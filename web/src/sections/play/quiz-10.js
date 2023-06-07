

export const Quiz10 = (props) => {
    const { questions } = props;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [unsavedChanges, setUnsavedChanges] = useState(true);

    const handleNext = () => {
        if (currentQuestion < questions.length - 1)
            setCurrentQuestion(currentQuestion + 1);
        else
            setUnsavedChanges(false);
            // Enviar respuestas
            // Recargar pagina
    }



}