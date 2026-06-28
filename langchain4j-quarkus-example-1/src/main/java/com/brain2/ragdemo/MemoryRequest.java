package com.brain2.ragdemo;

/** Body for POST /chat/memory — the session id is supplied by the caller. */
public record MemoryRequest(String sessionId, String message) {
}
