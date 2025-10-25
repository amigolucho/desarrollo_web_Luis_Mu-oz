import matplotlib.pyplot as plt

def line(data):
    # -------------------------------
    # Gráfico de líneas: avisos por día
    # -------------------------------
    dias = list(data.keys())
    avisos_dia = list(data.values())

    plt.figure(figsize=(8, 5))
    plt.plot(dias, avisos_dia, marker="o", linestyle="-", color="b")
    plt.title("Cantidad de avisos de adopción por día")

    plt.gcf().set_facecolor("#e6c6c6")
    plt.xlabel("Día")
    plt.ylabel("Cantidad de avisos")
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.savefig("./static/src/graficos/grafico_lineas.png")
    plt.close()

    return

def cake(data):
    tipos = ["Perros", "Gatos"]
    valores = list(data.values())

    plt.figure(figsize=(6, 6))
    plt.pie(valores, labels=tipos, autopct="%1.1f%%", startangle=90, colors=["#ff9999","#66b3ff"])
    plt.title("Avisos por tipo de mascota")

    plt.gcf().set_facecolor("#e6c6c6")
    plt.savefig("./static/src/graficos/grafico_torta.png")
    plt.close()

    return

def bars(data):
    meses = ["Ene", "Feb", "Mar", "Abr", "May"]
    avisos_perros = [20, 15, 30, 28, 22]
    avisos_gatos = [13, 15, 23, 17, 21]
    
    x = range(len(meses))
    bar_width = 0.4
    
    plt.figure(figsize=(8, 5))
    plt.bar([i - bar_width/2 for i in x], avisos_perros, width=bar_width, label="Perros", color="#ff9999")
    plt.bar([i + bar_width/2 for i in x], avisos_gatos, width=bar_width, label="Gatos", color="#66b3ff")
    
    plt.title("Avisos por mes y tipo de mascota")
    
    plt.gcf().set_facecolor("#e6c6c6")
    plt.xlabel("Mes")
    plt.ylabel("Cantidad de avisos")
    plt.xticks(x, meses)
    plt.legend()
    plt.savefig("./src/graphics/grafico_barras.png")
    plt.close()
    
    return