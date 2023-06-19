import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver las participaciones en eventos'
            });
        }

        const page = req.query.page ?? 1;


        try {
            // TODO: Esto sería solo para el profesor. Crear menú con eventos, y en cada uno pedir a esta petición
            const apiRes = await fetch(`${API_URL}/partidas/partidas/evento/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(
                    data
                );
            } else {
                return res.status(apiRes.status).json({
                    error: data
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar obtener las participaciones en eventos'
            });
        }
    }
    else if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para crear participaciones en eventos'
            });
        }

        const { evento } = req.body;

        const body = JSON.stringify({
            evento
        });

        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/evento/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 201) {
                return res.status(201).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data['error'],
                });
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                error: err
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
