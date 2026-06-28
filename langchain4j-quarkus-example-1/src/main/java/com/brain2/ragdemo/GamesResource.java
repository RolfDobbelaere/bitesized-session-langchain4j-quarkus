package com.brain2.ragdemo;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * Structured-output feature demo (no RAG). Returns a typed {@link GameChart} POJO that
 * quarkus-rest serializes to JSON — but the JSON the model produced was already mapped
 * to the record for you.
 */
@Path("/games")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class GamesResource {

    @Inject
    GameExpert gameExpert;

    @POST
    public GameChart best(GamesRequest request) {
        int count = request.count() != null ? request.count() : 3;
        return gameExpert.bestGames(count, request.genre());
    }
}
