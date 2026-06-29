package com.brain2.bss.demo01rag;

import com.brain2.bss.demo01rag.easy.EasyRagAiService;
import com.brain2.bss.demo01rag.naive.NaiveRagAiService;
import com.brain2.bss.demo01rag.transformed.TransformedRagAiService;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import dev.langchain4j.model.chat.ChatModel;

/**
 * Four endpoints answering the same question with four different RAG strategies —
 * see DEMO.md for what each one is meant to demonstrate.
 */
@Path("/ask")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.TEXT_PLAIN)
public class RagDemoResource {

    @Inject
    ChatModel chatModel;

    @Inject
    NaiveRagAiService naiveRagAiService;

    @Inject
    EasyRagAiService easyRagAiService;

    @Inject
    TransformedRagAiService transformedRagAiService;

    @POST
    @Path("/no-rag")
    public String noRag(AskRequest request) {
        return chatModel.chat(request.question());
    }

    @POST
    @Path("/naive-rag")
    public String naiveRag(AskRequest request) {
        return naiveRagAiService.chat(request.question());
    }

    @POST
    @Path("/easy-rag")
    public String easyRag(AskRequest request) {
        return easyRagAiService.chat(request.question());
    }

    @POST
    @Path("/transformed-rag")
    public String transformedRag(AskRequest request) {
        return transformedRagAiService.chat(request.question());
    }
}
