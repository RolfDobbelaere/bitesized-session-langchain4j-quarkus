package com.brain2.bss.demo02memory;

/** Body for POST /chat/memory — the session id is supplied by the caller. */
public record MemoryRequest(String sessionId, String message) {
}
