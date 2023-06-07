import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        
        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver el duelo'
            });
        }

        const { id } = req.query;
        
        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/duelo/${id}/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            const data = await apiRes.json();
            console.log(data);
            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json(data);
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    }else if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para jugar duelos'
            });
        }

        const { id } = req.query;

        // const { enunciado, opciones, tema, idioma, image } = req.body;

        // const body = JSON.stringify({
        //     enunciado,
        //     opciones,
        //     tema,
        //     idioma,
        //     imagen: image === '' ? null : image,
        // });

        // try {
        //     const apiRes = await fetch(`${API_URL}/preguntas/preguntas/${id}/`, {
        //         method: 'PATCH',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Authorization': `Bearer ${access}`,
        //             'Content-Type': 'application/json'
        //         },
        //         body: body
        //     });

        //     const data = await apiRes.json();

        //     if (apiRes.status === 200) {
        //         return res.status(200).json(data);
        //     } else {
        //         const flattenedResults = {};
        //         Object.keys(data.error).forEach((key) => {
        //             flattenedResults[key] = data.error[key][0];
        //         });
                
        //         if (flattenedResults['opciones']){
        //             flattenedResults['opcion1'] = flattenedResults['opcion2'] = flattenedResults['opcion3'] = flattenedResults['opcion4'] = flattenedResults['opciones'];
        //             delete flattenedResults['opciones'];
        //         }
                
        //         return res.status(apiRes.status).json({
        //             error: flattenedResults
        //         });
        //     }
        // } catch (err) {
        //     return res.status(500).json({
        //         error: err
        //     });
        // }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
