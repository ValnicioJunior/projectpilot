import React, { useState, useEffect } from 'react';
import '../styles/CarrosselTexto.css';

const CarrosselTexto = () => {

    const textos = [
        "Alcance resultados expressivos no seu empreendimento",
        "Aprenda, aplique e conquiste o seu espaço no mercado.",
        "Construa um futuro sólido com conhecimento estratégico."
    ];

    const [slideAtual, setSlideAtual] = useState(0);

    const irParaSlide = (index) => {
        setSlideAtual(index);
    };

    const mudarSlide = (direcao) => {
        let novoIndex = slideAtual + direcao;
        if (novoIndex < 0) novoIndex = textos.length - 1;
        if (novoIndex >= textos.length) novoIndex = 0;
        setSlideAtual(novoIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => mudarSlide(1), 5000);
        return () => clearInterval(interval);
    }, [slideAtual]);


    return (
        <div className="carrossel">
            <div className="slides">
                {textos.map((texto, index) => (
                    <div key={index} className={`slide ${index === slideAtual ? 'ativo' : ''}`}>
                        {texto}
                    </div>
                ))}
            </div>

            <button className="seta esquerda" onClick={() => mudarSlide(-1)}>❮</button>
            <button className="seta direita" onClick={() => mudarSlide(1)}>❯</button>

            <div className="pontos">
                {textos.map((_, index) => (
                    <span
                        key={index}
                        className={`ponto ${index === slideAtual ? 'ativo' : ''}`}
                        onClick={() => irParaSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    )
}

export default CarrosselTexto