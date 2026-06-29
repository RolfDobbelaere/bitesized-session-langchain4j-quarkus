package com.brain2.bss.demo02memory;

import dev.langchain4j.service.MemoryId;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * Chat-memory feature demo (no RAG). Call it twice with the same sessionId to show the
 * model remembering; call with a different sessionId to show the memories are isolated.
 */
@Path("/chat")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.TEXT_PLAIN)
public class MemoryResource {

    @Inject
    ConversationalAssistant assistant;

    @POST
    @Path("/memory")
    public String chat(MemoryRequest request) {
        return assistant.chat(request.sessionId(), request.message());
    }
}
