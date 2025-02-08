import {Hono} from 'hono';
import {validator} from 'hono/validator';
import { addUser } from '../rules/addRules';
import { db } from '../db/db';
import { Users } from '../db/schema';
import { updateUser } from '../rules/addRules';
import { eq } from 'drizzle-orm';

const app = new Hono().basePath('/user');

app.post('/', validator('json', (value, c)=>{

    const parsed = addUser.safeParse(value);
    if(!parsed.success) return c.json({message: parsed.error.format()}, 422);
    return parsed.data

}), async(c)=>{
    const {name, email} = c.req.valid('json');

    try {
        await db.insert(Users).values({name, email});

        return c.json({message: 'User added successfully'})
    } catch (error) {
        const errormessage = (error as Error).message;
        
        if(errormessage.includes('UNIQUE')) return c.json({error: 'Email is already taken'});

        return c.json({error: errormessage}, 500);
    }
})

app.put('/:id', validator('json', (value, c)=>{

    const parsed = updateUser.safeParse(value);
    if(!parsed.success) return c.json({message: parsed.error.format()}, 422);
    return parsed.data

}), async(c)=>{
    const {name, email} = c.req.valid('json');
    const {id }= c.req.param()

    try {

       const user =  await db.update(Users).set({name, email}).where(eq(Users.id, Number(id))).returning();
       if(!user[0]) return c.json({message: 'User does not exist'});

        return c.json({message: 'User updated successfully'})
    } catch (error) {
        const errormessage = (error as Error).message;
        
        if(errormessage.includes('UNIQUE')) return c.json({error: 'Email is already taken'});

        return c.json({error: errormessage}, 500);
    }
})

app.delete('/:id', async(c)=>{
    const {id} = c.req.param();
    try {
        const user = await db.delete(Users).where(eq(Users.id, Number(id))).returning();
        if (!user[0]) return c.json({ message: 'User does not exist' });

        return c.json({ message: 'User deleted successfully' })
    } catch (error) {
        const errormessage = (error as Error).message;
        return c.json({ error: errormessage }, 500);
    }
})

app.get('/', async(c)=>{

    try {
        const users = await db.select().from(Users).all();
        if(!users[0]) return c.json({message: 'No users found'});

        return c.json({users})
    } catch (error) {
        const errormessage = (error as Error).message;
        return c.json({ error: errormessage }, 500);
    }
})

app.get('/:id', async(c)=>{
    const { id } = c.req.param()

    try {
        const user = await db.select().from(Users).where(eq(Users.id, Number(id)));
        if (!user[0]) return c.json({ message: `User does not exist` });

        return c.json({ user })
    } catch (error) {
        const errormessage = (error as Error).message;
        return c.json({ error: errormessage }, 500);
    }
})

export {app as userRoute}