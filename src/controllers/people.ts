import { RequestHandler } from "express";
import { z } from "zod";
import * as people from '../services/people';
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;
    
    const items = await people.getAll({
        id_event: parseInt(id_event), 
        id_group: parseInt(id_group)
    });

    if(items) return res.json({ person: items});

    res.json({ error: 'Ocoreu um erro'})
}

export const getPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;
    
    const personItems = await people.getPerson({
        id_event: parseInt(id_event), 
        id_group: parseInt(id_group),
        id: parseInt(id)
    });

    if(personItems) return res.json({ person: personItems});

    res.json({ error: 'Ocoreu um erro'})
}

export const addPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const addPersonSchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|/gm, '')),
    });

    const body = addPersonSchema.safeParse(req.body);

    if(!body.success) return res.json({ error: 'Dados inválidos'});

    const newPerson = await people.addPerson({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        name: body.data.name,
        cpf: body.data.cpf,
    });
    

    if(newPerson ) return res.status(201).json({ person: newPerson });

    res.json({ error: 'Ocoreu um erro'})
}

export const updatePerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;
    
    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|/gm, '')).optional(),
        matched: z.string().optional()
    });

    const body = updatePersonSchema.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos'});

    const updatedPerson = await people.updatePerson({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        id: parseInt(id),
    }, body.data)

    if(updatedPerson) {
        const personItem = await people.getPerson({
            id: parseInt(id),
            id_event: parseInt(id_event),
        });
        return res.json({ person: personItem})
    };

    res.json({ error: 'Ocoreu um erro'})
}

export const deletePerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;
    
    const deletedPerson = await people.removePerson({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        id: parseInt(id),
    })

    if(deletedPerson) return res.status(201).json({ person: deletedPerson });

    res.json({ error: 'Ocoreu um erro'})
}

export const searchPerson: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    
    const searchPersonSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|/gm, '')),
    });
    const query = searchPersonSchema.safeParse(req.query);
    if(!query.success) return res.json({ error: 'Dados inválidos'});

    const personItem = await people.getPerson({
        id_event: parseInt(id_event),
        cpf: query.data.cpf
    });
    if(personItem && personItem.matched) {
        const matchId = decryptMatch(personItem.matched);

        const personMatched = await people.getPerson({
            id_event: parseInt(id_event),
            id: matchId,
        });

        if(personMatched) {
            return res.json({
                person: {
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched: {
                    id: personMatched.id,
                    name: personMatched.name
                }
            })
        }
    }

    res.json({ error: 'Ocoreu um erro'})
}

