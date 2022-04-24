import { useEffect, useState } from "react";
import blank from "./images/blank.png"
import blue from "./images/blue-candy.png"
import yellow from "./images/yellow-candy.png"
import red from "./images/red-candy.png"
import orange from "./images/orange-candy.png"
import green from "./images/green-candy.png"
import purple from "./images/purple-candy.png"

const tamano = 8;
const candyColor = [blue, green, orange, purple, red, yellow]

const App = () => {

  const [coloresArreglo, setcoloresArreglo] = useState([])
  const [puntaje, setpuntaje] = useState(0)
  const [cuadroArrastrado, setcuadroArrastrado] = useState()
  const [cuadroCambiado, setcuadroCambiado] = useState()

  const dragStart  = e => {
    setcuadroArrastrado(parseInt(e.target.getAttribute('data-id')))
  }
  const dragDrop  = e => {
    setcuadroCambiado(parseInt(e.target.getAttribute('data-id')))
  }
  const dragEnd = e => {
    const posibleMove = [cuadroArrastrado+1,cuadroArrastrado-1,cuadroArrastrado+8,cuadroArrastrado-8]
    if(posibleMove.includes(cuadroCambiado)){
      const aux = coloresArreglo[cuadroCambiado]
      coloresArreglo[cuadroCambiado] = coloresArreglo[cuadroArrastrado]
      coloresArreglo[cuadroArrastrado] = aux
    }
  }

  const reemplazarCuadros = () => {
    for (let i = 0; i < 64 - tamano; i++) {
      if (coloresArreglo[i] === blank && [0,1,2,3,4,5,6,7].includes(i)) {
        coloresArreglo[i] = candyColor[Math.floor(Math.random() * candyColor.length)]
      }
      if (coloresArreglo[i + tamano] === blank) {
        coloresArreglo[i + tamano] = coloresArreglo[i];
        coloresArreglo[i] = blank
      }
    }
  }

  const validarFilasDeTres = () => {
    const finales = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]
    for (let i = 0; i < 62; i++) {
      if(finales.includes(i)) continue
      const fila3 = [i,i+1,i+2]
      const colorEvaluado = coloresArreglo[i];
      if( fila3.every(e=>coloresArreglo[e]===colorEvaluado) ){
        fila3.forEach(cuadro=>coloresArreglo[cuadro] = blank);
        if(colorEvaluado!=blank) setpuntaje(n=>n+3)
      }
    }
  }

  const validarFilasDeCuatro = () => {
    const finales = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]
    for (let i = 0; i < 62; i++) {
      if(finales.includes(i)) continue
      const fila4 = [i,i+1,i+2]
      const colorEvaluado = coloresArreglo[i];
      if( fila4.every(e=>coloresArreglo[e]===colorEvaluado) ){
        fila4.forEach(cuadro=>coloresArreglo[cuadro] = blank);
        if(colorEvaluado!=blank) setpuntaje(n=>n+4)
      }
    }
  }

  const validarColumnasDeTres = () => {
    for (let i = 0; i < 47; i++) {
      const columna3 = [i,i+tamano,i+tamano+tamano]
      const colorEvaluado = coloresArreglo[i];

      if (columna3.every(e=>coloresArreglo[e]===colorEvaluado)) {
        columna3.forEach(cuadro=>coloresArreglo[cuadro] = blank);
        if(colorEvaluado!=blank) setpuntaje(n=>n+3)
      }
    }
  }
  
  const validarColumnasDeCuatro = () => {
    for (let i = 0; i < 39; i++) {
      const columna4 = [i,i+tamano,i+tamano+tamano,i+tamano+tamano+tamano]
      const colorEvaluado = coloresArreglo[i];

      if (columna4.every(e=>coloresArreglo[e]===colorEvaluado)) {
        columna4.forEach(cuadro=>coloresArreglo[cuadro] = blank);
        if(colorEvaluado!=blank)setpuntaje(n=>n+4)
      }
    }
  }

  const crearTablero = () => {
    const randomColorArray = []
    for (let i = 0; i < tamano * tamano; i++) {
      randomColorArray.push(candyColor[Math.floor(Math.random() * candyColor.length)])
    }
    setcoloresArreglo(randomColorArray)
  }
  
  useEffect(() => {
    crearTablero();
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      validarColumnasDeCuatro()
      validarFilasDeCuatro()
      validarColumnasDeTres()
      validarFilasDeTres()
      reemplazarCuadros()
      setcoloresArreglo([...coloresArreglo])
    }, 500);
    return ()=>clearInterval(timer)
  }, [reemplazarCuadros,validarFilasDeCuatro,validarFilasDeTres,validarColumnasDeTres,validarColumnasDeCuatro,coloresArreglo])
  
  return (
    <div className="app">
      <h1>{puntaje}</h1>
      <div className="game">
        {coloresArreglo.map((cc,i)=>(
          <img 
            key={i}
            src={cc}
            data-id={i}
            draggable={true}
            onDragStart={dragStart} 
            onDragOver={e=>e.preventDefault()}
            onDragEnter={e=>e.preventDefault()}
            onDragLeave={e=>e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />)
        )}
      </div>
    </div>
  )
}

export default App