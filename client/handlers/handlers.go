package handlers

import (
	"github.com/gin-gonic/gin"
	// "github.com/gorilla/websocket"
)

// func WSHandler() {

// }

func HTMLHandler(file string) func(*gin.Context) {
	return func(c *gin.Context) {
		c.HTML(200, file, gin.H{})
	}
}
