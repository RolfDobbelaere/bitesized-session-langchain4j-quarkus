package com.brain2.bss.demo03games;

/** One game in the structured-output demo. The LLM fills these fields directly. */
public record Game(String name, String publisher, int metacriticScore, int releaseYear) {
}
