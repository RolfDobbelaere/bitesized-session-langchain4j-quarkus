package com.brain2.bss.demo04tools;

/**
 * Body for POST /mail/triage — an incoming message to be screened by the @Tool demo.
 * Jackson maps the JSON straight onto this record; the AI service then reasons over it.
 */
public record MessageDTO(String sender, String subject, String message) {
}
