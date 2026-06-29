package com.brain2.bss.demo04tools;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * @Tool feature demo. POST a {@link MessageDTO} and the model triages it, calling one of the
 * tools in {@link MailTools}: it either logs "Seems Clean!" or sends the message on to
 * security@brain2.com via the local SMTP server. The returned text is the model's own
 * one-line account of what it decided.
 */
@Path("/mail")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.TEXT_PLAIN)
public class ToolDemoResource {

    @Inject
    MailGuardian guardian;

    @POST
    @Path("/triage")
    public String triage(MessageDTO message) {
        return guardian.triage(message.sender(), message.subject(), message.message());
    }
}
