package com.brain2.bss.demo03games;

/** Body for POST /games. Count is optional (defaults to 3). */
public record GamesRequest(String genre, Integer count) {
}
