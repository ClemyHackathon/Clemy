package com.clemy

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ClemyApplication

fun main(args: Array<String>) {
	runApplication<ClemyApplication>(*args)
}
