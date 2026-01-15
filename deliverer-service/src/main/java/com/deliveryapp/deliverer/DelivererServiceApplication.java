package com.deliveryapp.deliverer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class DelivererServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DelivererServiceApplication.class, args);
    }
}
