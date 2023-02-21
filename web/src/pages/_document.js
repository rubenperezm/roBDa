import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet='UTF-8' />
        <meta name='description' content='Plataforma de aprendizaje comunitaria de Bases de Datos basada en cuestionarios cortos'/>
        <meta name='keywords' content='databases, tests, ER, SQL'/>
        <link rel='icon' href='/favicon.ico'/>
      </Head>  
      <body style={{backgroundColor: '#eeeeee', margin: 0, padding: 0}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
