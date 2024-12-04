document.getElementById('model').addEventListener('change', function () {
  const selectedModel = this.value;
  document.querySelectorAll('.input-group').forEach(group => group.classList.add('hidden'));

  if (selectedModel === 'model1') {
    document.getElementById('inputs-model1').classList.remove('hidden');
  } else if (selectedModel === 'model2') {
    document.getElementById('inputs-model2').classList.remove('hidden');
  } else if (selectedModel === 'model3') {
    document.getElementById('inputs-model3').classList.remove('hidden');
  }
});

document.getElementById('reaction-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const model = document.getElementById('model').value;
  const caInicial = parseFloat(document.getElementById('caInicial').value || 0);
  const tempo = parseFloat(document.getElementById('tempo').value || 0);
  let resultado;

  try {
    if (model === 'model1') {
      const k0 = parseFloat(document.getElementById('k0').value || 0);
      resultado = calcularOrdemZero(k0, caInicial, tempo);
    } else if (model === 'model2') {
      const k1 = parseFloat(document.getElementById('k1').value || 0);
      resultado = calcularOrdemUm(k1, caInicial, tempo);
    } else if (model === 'model3') {
      const muMax = parseFloat(document.getElementById('muMax').value || 0);
      const y = parseFloat(document.getElementById('y').value || 0);
      const ks = parseFloat(document.getElementById('ks').value || 0);
      resultado = calcularMonod(muMax, y, ks, caInicial, tempo);
    }

    const resultadoDiv = document.getElementById('resultado');
    if (resultado !== null) {
      resultadoDiv.innerHTML = `O resultado da concentração após ${tempo} unidades de tempo é: <strong>${resultado.toFixed(4)}</strong>`;
      resultadoDiv.classList.remove('hidden');
    } else {
      resultadoDiv.innerHTML = 'Não foi possível calcular. Verifique os valores inseridos.';
      resultadoDiv.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Erro ao calcular:', error.message);
    alert('Erro ao calcular. Verifique os valores e tente novamente.');
  }
});

function calcularOrdemZero(k, caInicial, tempo) {
  return caInicial - k * tempo;
}

function calcularOrdemUm(k, caInicial, tempo) {
  return caInicial * Math.exp(-k * tempo);
}

function calcularMonod(muMax, y, ks, caInicial, tempo) {
  const rhs = (muMax / y) * tempo + caInicial;
  let ca = caInicial;
  let iteracoes = 0;
  const maxIteracoes = 100;
  const tolerancia = 1e-6;

  while (iteracoes < maxIteracoes) {
    const func = ca + ks * Math.log(ca) - rhs;
    const derivada = 1 + ks / ca;

    const caNova = ca - func / derivada;

    if (Math.abs(caNova - ca) < tolerancia) {
      return caNova;
    }

    ca = caNova;
    iteracoes++;
  }

  return null;
}


document.getElementById('reaction-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const model = document.getElementById('model').value;
  const caInicial = parseFloat(document.getElementById('caInicial').value || 0);
  const tempo = parseFloat(document.getElementById('tempo').value || 0);
  const unidadeTempo = document.getElementById('unidade-tempo').value;

  // Converter o tempo para segundos
  const tempoPadronizado = converterTempoParaSegundos(tempo, unidadeTempo);

  let resultado;
  const parametros = { 'Cᴀ Inicial': caInicial, 'Tempo (s)': tempoPadronizado };

  if (model === 'model1') {
    const k0 = parseFloat(document.getElementById('k0').value || 0);
    resultado = calcularOrdemZero(k0, caInicial, tempoPadronizado);
    parametros['k₀'] = k0;
  } else if (model === 'model2') {
    const k1 = parseFloat(document.getElementById('k1').value || 0);
    resultado = calcularOrdemUm(k1, caInicial, tempoPadronizado);
    parametros['k₁'] = k1;
  } else if (model === 'model3') {
    const muMax = parseFloat(document.getElementById('muMax').value || 0);
    const y = parseFloat(document.getElementById('y').value || 0);
    const ks = parseFloat(document.getElementById('ks').value || 0);
    resultado = calcularMonod(muMax, y, ks, caInicial, tempoPadronizado);
    parametros['μₘₐₓ'] = muMax;
    parametros['Y'] = y;
    parametros['Kₛ'] = ks;
  }

  const tabelaResultados = document.getElementById('tabela-resultados');
  tabelaResultados.innerHTML = '';

  Object.keys(parametros).forEach(key => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${key}</td><td>${parametros[key]}</td>`;
    tabelaResultados.appendChild(row);
  });

  if (resultado !== null) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>Resultado</td><td>${resultado.toFixed(4)}</td>`;
    tabelaResultados.appendChild(row);

    document.getElementById('resultado').classList.remove('hidden');
  } else {
    document.getElementById('resultado').classList.remove('hidden');
    tabelaResultados.innerHTML = `<tr><td colspan="2">Não foi possível calcular. Verifique os valores inseridos.</td></tr>`;
  }
});

function converterTempoParaSegundos(tempo, unidade) {
  switch (unidade) {
    case 'minutos':
      return tempo * 60;
    case 'horas':
      return tempo * 3600;
    case 'dias':
      return tempo * 86400;
    default:
      return tempo; // Já está em segundos
  }
}
