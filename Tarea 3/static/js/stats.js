Highcharts.chart("grafico-lineas", {
  chart: {
    type: "line",
  },
  title: {
    text: "Cantidad de avisos de adopciones por día",
  },
  xAxis: {
    title: {
      text: "Día",
    },
  },
  yAxis: {
    title: {
      text: "Numero de avisos",
    },
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    borderWidth: 0,
  },
  tooltip: {
    shared: true,
    crosshairs: true,
  },

  series: [
    {
      name: "Gráfico de lineas",
      data: [],
      lineWidth: 1,
      marker: {
        enabled: true,
        radius: 4,
      },
      color: "#FC2865",
    },
  ],
});

Highcharts.chart('grafico-pie', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Avisos por tipo de mascota'
    },
    series: [{
        name: 'Clases',
        colorByPoint: true,
        data: [{
            name: 'Clase A',
            y: 60
        }, {
            name: 'Clase B',
            y: 40
        }], 
        dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f} %' // Muestra el nombre y el porcentaje
        }
    }]
});

Highcharts.chart("grafico-barras", {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Cantidad de avisos por mes y tipo de mascota'
    },
    xAxis: {
        title: {
            text: 'Mes'
        },
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    yAxis: {
        title: {
            text: 'Cantidad de aviso'
        }
    },
    series: [{
        name: 'Producto A',
        data: [10, 15, 20, 25, 30]
    }, {
        name: 'Producto B',
        data: [5, 10, 15, 20, 25]
    }]
});

fetch("http://127.0.0.1:5000/get-stats-data")
  .then((response) => response.json())
  .then((data) => {
    let line_Data = data[0];
    let [[g, gatos], [p, perros]] = Object.entries(data[1]);
    
    let pie_Data = [{name: 'Gatos', y: gatos/(perros+gatos)}, {name: 'Perros', y: perros/(perros+gatos)}]

    let cats = []
    let dogs = []


    Object.entries(data[2]).map((item) => {
        cats.push(item[1].gato)
        dogs.push(item[1].perro)
    })
    
    let bar_data = [{name: 'Gatos', data: cats},{name: 'Perros', data: dogs}]

    // Get the chart by ID
    const line_chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-lineas"
    );

    const pie_chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-pie"
    );

    const bar_chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-barras"
    );

    // Update the chart with new data
    line_chart.update({
      series: [
        {
          data: Object.values(line_Data),
        },
      ],
      xAxis: {
        categories: Object.keys(line_Data),
        title: { text: 'Día'}
      }
    });
    pie_chart.update({
      series: [
        {
          data: pie_Data,
        },
      ],
    });
    bar_chart.update({
      series: bar_data,
    });

  })
  .catch((error) => console.error("Error:", error));

  let fetchAJAX = (url) => {
  /*
    Advantages:
    1. Simple and modern: The Fetch API provides a simpler, more powerful, and more flexible alternative to XHR.
    2. Promise-based: Fetch uses Promises, which can make your code cleaner and easier to understand, especially for complex, asynchronous operations.
    3. Automatic JSON parsing: Fetch can automatically parse JSON responses to JavaScript objects.

    Disadvantages:
    1. Browser compatibility: While most modern browsers support Fetch, it's not available in Internet Explorer and older versions of other browsers.
    2. No automatic request cancelation: Unlike XHR, Fetch doesn't provide a built-in way to cancel a request.
    3. Poor error handling: By default, Fetch only rejects a Promise on network failure, not on HTTP error status (like 404 or 500). 
    */
  fetch(url, {
    mode: "cors",
    credentials: "include",
  }) // 1 acceder al url
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // 2 parseamos el response a un json
    })
    .then((ajaxResponse) => {
      populateMatchList(ajaxResponse["data"]); // 3 le pasamos el data a populate...()
      console.log(ajaxResponse);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};

let ajaxMethod = "fetch";

let ajaxHandlerMapper = {
  jquery: jqueryAJAX,
  xhr: xhrAJAX,
  fetch: fetchAJAX,
};

let handleAJAX = (event) => {
  let ajaxHandler = ajaxHandlerMapper[ajaxMethod];
  ajaxHandler(`${window.origin}/get-conf/${event.target.value}`);
};

inputSearch.addEventListener("input", handleAJAX);