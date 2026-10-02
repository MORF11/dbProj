## ВашПромоутер.com
## Система управления заявками и ресурсами организации для компании вашПромоутер

ER диаграмма
![ER-diagram](./media/er.png)

Диаграмма базы данных
![DB-diagram](./media/db.png)

## API enpoints:
# Clients
* GET api/v1/getClient
* POST api/v1/postClient
# Requests
* GET api/v1/getStatus
* POST api/v1/postRequest
* POST api/v1/setStatus
* POST api/v1/finishRequest
# Order History
* GET api/v1/getOrder
* POST api/v1/addOrder
# Canceled Orders
* GET api/v1/getCanceledOrder
* POST api/v1/addCanceledOrder
# Workers
* GET api/v1/getWorker
* POST api/v1/postWorker
* POST api/v1/deleteWorker
# Reviews
* GET api/v1/getReview
* POST api/v1/postReview