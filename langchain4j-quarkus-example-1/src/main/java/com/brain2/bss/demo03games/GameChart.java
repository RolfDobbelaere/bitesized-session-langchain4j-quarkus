package com.brain2.bss.demo03games;

import java.util.List;

/** Top-level POJO the LLM returns for the structured-output demo. */
public record GameChart(String genre, List<Game> games) {
}
