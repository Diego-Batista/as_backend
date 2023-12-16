import { RequestHandler } from "express";
import { z } from "zod";
import * as groups from '../services/groups';

export const getAll: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const items = await groups.getAll(parseInt(id_event));

    if(items) return res.json({ events: items});

    res.json({ error: 'Ocoreu um erro'})
}

export const getGroup: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const groupItems = await groups.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });

    if(groupItems) return res.json({ events: groupItems });

    res.json({ error: 'Ocoreu um erro'})
}

export const addGroup: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const addGroupSchema = z.object({
        name: z.string()
    });

    const body = addGroupSchema.safeParse(req.body);

    if(!body.success) return res.json({ error: 'Dados inválidos'});

    const newGroup = await groups.addGroup({
        id_event: parseInt(id_event),
        name: body.data.name,
    });
    if(newGroup) return res.status(201).json({ event: newGroup });

    res.json({ error: 'Ocoreu um erro'});
}

export const updateGroup: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const updateGroupSchema = z.object({
        name: z.string().optional()
    });

    const body = updateGroupSchema.safeParse(req.body);

    if(!body.success) return res.json({ error: 'Dados inválidos'});

    const updatedGroup = await groups.updateGroup({
        id: parseInt(id),
        id_event: parseInt(id_event),
    }, body.data);

    if(updatedGroup) return res.status(201).json({ group: updatedGroup });

    res.json({ error: 'Ocoreu um erro'});
}

export const deleteGroup: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const deleteGroup = await groups.deleteGroup({
        id: parseInt(id),
        id_event: parseInt(id_event),
    });

    if(deleteGroup) return res.status(201).json({ group: deleteGroup});

    res.json({ error: 'Ocoreu um erro'});
}