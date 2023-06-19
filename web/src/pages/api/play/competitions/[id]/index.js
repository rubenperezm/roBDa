import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        
        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver la participación en el evento'
            });
        }

        const { id } = req.query;
        
        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/evento/${id}/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            const data = await apiRes.json();
            
            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json(data);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }
    }else if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para jugar la participación en el evento'
            });
        }

        const { id } = req.query;

        const { respuestas } = req.body;

        const body = JSON.stringify({
            respuestas
        });


        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/evento/${id}/`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();
            if (apiRes.status === 200) {
                data.forEach((question) => {
                    if (question.imagen)
                        question.imagen = {path: question.imagen}
                });
                return res.status(200).json(data);
            } else {        
                return res.status(apiRes.status).json({data});
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    }else if (req.method === 'PATCH') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para jugar partidas'
            });
        }

        const { id } = req.query;
        const { respuestas } = req.body;

        const body = JSON.stringify({
            respuestas
        });

        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/evento/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body
            });

            const data = await apiRes.json();
            console.log(data);
            return res.status(apiRes.status).json({
                data
            });

        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
