import Head from 'next/head';

function PageLayout({ children, title = 'Robda', color = 'white'}) {

    return (
        <div style={{backgroundColor: color}}>
            <Head>
                <title>{title}</title>
                <meta charSet='UTF-8' />
                <meta name='description' content='Plataforma de aprendizaje comunitaria de Bases de Datos basada en cuestionarios cortos'/>
                <meta name='keywords' content='databases, tests, ER, SQL'/>
                <meta name='viewport' content='width=device-width, inital-scale=1' />
                <link rel='icon' href='/favicon.ico'/>
            </Head>
            <main>
                {children}
            </main>
        </div>
            
    );
};

export default PageLayout;