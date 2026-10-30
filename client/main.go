package main

import (
	"dbproj/handlers"

	"github.com/gin-gonic/gin"
	// "github.com/gorilla/websocket"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*.html")
	r.Static("/static", "./static")
	r.GET("/", handlers.HTMLHandler("index.html"))
	r.GET("/admin.html", handlers.HTMLHandler("admin.html"))
	r.GET("/login.html", handlers.HTMLHandler("login.html"))

	r.Run("localhost:8081")
}
