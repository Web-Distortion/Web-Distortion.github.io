package proxy

import (
	"github.com/go-redis/redis"
	"log"
)

func initRedis() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	_, err := client.Ping().Result()
	if err != nil {
		log.Println("redis init error!")
		return client
	}
	return client
}
func getHTMLPath (client *redis.Client, key string) string {
	val, err := client.Get(key).Result()
	if err != nil {
		log.Println("key doesn't exist!")
		return ""
	}
	return val
}