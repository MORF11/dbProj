-- Выполнить один раз в SQL Server Management Studio перед запуском приложения.
-- Используется исходная база test и существующая таблица dbo.test с заявками.
-- Строка подключения находится в ado.cs. Скрипт не удаляет исходные данные.
-- Исполнитель хранится как имя (до 200 символов), так как таблица Users в архиве не описана.
-- AuthorId пока nullable, без внешнего ключа: таблица пользователей не предусмотрена.
-- При добавлении Users настроить FK для AuthorId и JOIN в ado.getcomments.
-- Все даты новых записей сохраняются в UTC и возвращаются с суффиксом Z.
-- Статусы API: новая, в работе, завершена, отменена.
-- Запрещён переход завершена -> в работе; повтор текущего значения даёт 409.
-- Авторизация не настроена: анонимные комментарии доступны для изменения.
-- Для реального приложения подключить аутентификацию и [Authorize] на endpoints.
USE [test];
GO
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    IF OBJECT_ID(N'dbo.test', N'U') IS NULL
        THROW 50001, N'Не найдена исходная таблица dbo.test с заявками.', 1;
    IF COL_LENGTH(N'dbo.test', N'id') IS NULL
        THROW 50002, N'В таблице dbo.test отсутствует поле id.', 1;

    -- FK требует уникальность id заявки. Существующий PK/UNIQUE сохраняется.
    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes i
        WHERE i.object_id = OBJECT_ID(N'dbo.test') AND i.is_unique = 1
          AND i.has_filter = 0 AND i.is_disabled = 0
          AND (SELECT COUNT(*) FROM sys.index_columns ic
               WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
                 AND ic.key_ordinal > 0) = 1
          AND EXISTS (SELECT 1 FROM sys.index_columns ic
                      JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                      WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
                        AND ic.key_ordinal = 1 AND c.name = N'id')
    )
        CREATE UNIQUE INDEX UX_test_RequestId ON dbo.test(id);

    IF COL_LENGTH(N'dbo.test', N'executor') IS NULL
        ALTER TABLE dbo.test ADD executor nvarchar(200) NULL;
    IF COL_LENGTH(N'dbo.test', N'task') IS NULL
        ALTER TABLE dbo.test ADD task nvarchar(2000) NULL;

    IF OBJECT_ID(N'dbo.RequestHistory', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.RequestHistory (
            Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestHistory PRIMARY KEY,
            RequestId int NOT NULL,
            ChangeType nvarchar(20) NOT NULL,
            OldValue nvarchar(2000) NULL,
            NewValue nvarchar(2000) NULL,
            ChangedAt datetime2(7) NOT NULL CONSTRAINT DF_RequestHistory_ChangedAt DEFAULT SYSUTCDATETIME(),
            Comment nvarchar(2000) NULL,
            CONSTRAINT FK_RequestHistory_Request FOREIGN KEY (RequestId) REFERENCES dbo.test(id),
            CONSTRAINT CK_RequestHistory_Type CHECK (ChangeType IN (N'stage', N'executor', N'task'))
        );
        CREATE INDEX IX_RequestHistory_RequestDate ON dbo.RequestHistory(RequestId, ChangedAt, Id);
    END;

    IF OBJECT_ID(N'dbo.RequestComments', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.RequestComments (
            Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestComments PRIMARY KEY,
            RequestId int NOT NULL,
            AuthorId int NULL,
            [Text] nvarchar(4000) NOT NULL,
            CreatedAt datetime2(7) NOT NULL CONSTRAINT DF_RequestComments_CreatedAt DEFAULT SYSUTCDATETIME(),
            CONSTRAINT FK_RequestComments_Request FOREIGN KEY (RequestId) REFERENCES dbo.test(id),
            CONSTRAINT CK_RequestComments_Author CHECK (AuthorId IS NULL OR AuthorId > 0),
            CONSTRAINT CK_RequestComments_Text CHECK (
                LEN(LTRIM(RTRIM(REPLACE(REPLACE(REPLACE(REPLACE([Text], NCHAR(9), N''), NCHAR(10), N''), NCHAR(13), N''), NCHAR(160), N'')))) > 0
            )
        );
        CREATE INDEX IX_RequestComments_RequestDate ON dbo.RequestComments(RequestId, CreatedAt, Id);
    END;

    IF OBJECT_ID(N'dbo.RequestAttachments', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.RequestAttachments (
            Id int IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestAttachments PRIMARY KEY,
            RequestId int NOT NULL,
            OriginalName nvarchar(255) NOT NULL,
            StoredName nvarchar(40) NOT NULL CONSTRAINT UQ_RequestAttachments_StoredName UNIQUE,
            ContentType nvarchar(100) NOT NULL,
            SizeBytes bigint NOT NULL,
            CreatedAt datetime2(7) NOT NULL CONSTRAINT DF_RequestAttachments_CreatedAt DEFAULT SYSUTCDATETIME(),
            CONSTRAINT FK_RequestAttachments_Request FOREIGN KEY (RequestId) REFERENCES dbo.test(id),
            CONSTRAINT CK_RequestAttachments_Size CHECK (SizeBytes > 0 AND SizeBytes <= 5242880),
            CONSTRAINT CK_RequestAttachments_Type CHECK (ContentType IN (N'application/pdf', N'image/png', N'image/jpeg'))
        );
        CREATE INDEX IX_RequestAttachments_Request ON dbo.RequestAttachments(RequestId, CreatedAt, Id);
    END;
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO

-- Маршрут исходного контроллера сохранён: /api/v1.
-- PATCH /api/v1/changeStatus
-- {"id":1,"stage":"в работе","comment":"Начало работы"}
-- PATCH /api/v1/assignExecutor
-- {"id":1,"executor":"Иван Иванов","comment":"Назначен исполнитель"}
-- PATCH /api/v1/changeTask
-- {"id":1,"task":"Проверить оборудование","comment":"Уточнена задача"}
-- GET /api/v1/getHistory/1
-- GET /api/v1/getComments/1
-- POST /api/v1/postComment/1      тело: {"text":"Комментарий"}
-- PUT /api/v1/changeComment/1/2  тело: {"text":"Новый текст"}
-- DELETE /api/v1/deleteComment/1/2
-- POST /api/v1/postAttachment/1 multipart/form-data, поле file.
-- Файлы сохраняются в RequestFiles рядом с исполняемой сборкой, вне wwwroot.
