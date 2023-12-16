import { RequestHandler } from "express";
import { z } from "zod";
import * as events from '../services/events';
import * as people from '../services/people';

export const getAll: RequestHandler = async (req, res) => {
    const items = await events.getAll();
    if(items) return res.json({ events: items});

    res.json({ error: 'Ocoreu um erro'})
}

export const getEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const eventItem = await events.getOne(parseInt(id));

    if(eventItem) return res.json({ event: eventItem });

    res.json({ error: 'Ocoreu um erro'})
}

export const addEvent: RequestHandler = async (req, res) => {
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    });
    const body = addEventSchema.safeParse(req.body);

    if(!body.success) return res.json({ error: 'Dados inválidos'});

    const newEvent = await events.add(body.data);
    if(newEvent) return res.status(201).json({ event: newEvent });

    res.json({ error: 'Ocoreu um erro'})
}

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        grouped: z.boolean().optional(),
    })

    const body = updateEventSchema.safeParse(req.body);

    if(!body.success) return res.json({ error: 'Dados inválidos'});

    const updatedEvent = await events.update(parseInt(id), body.data);
    if(updatedEvent) {
        if(updatedEvent.status) {
            const result = await events.doMatches(parseInt(id));
            if(!result) {
                return res.json({ error: 'Grupos impossíveis de sortear.'})
            }
        } else {
            await people.updatePerson({ id_event: parseInt(id) }, { matched: ''});
        }

        return res.status(201).json({ event: updatedEvent});
    }

    res.json({ error: 'Ocoreu um erro'});
}

export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const deletedEvent = await events.deleteEvent(parseInt(id));
    if(deletedEvent) return res.json({ event: 'Deletado com sucesso'});

    res.json({ error: 'Ocoreu um erro'});
}

