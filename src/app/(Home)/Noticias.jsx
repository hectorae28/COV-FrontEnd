import React, { useMemo } from 'react';
import CardNoticias from '../Components/Home/CardNoticias';

const Noticias = () => {
    const newsItems = [
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/ancho.png"],
            size: "normal"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "PROYECTO DE ACTUALIZACIÓN DE LEY ORGÁNICA DE LA ODONTOLOGÍA",
            description: "Artículo 1. Objeto de la Ley. La presente Ley tiene por objeto establecer las bases...",
            imageUrl: ["/assets/noticias/normal2.png", "/assets/noticias/normal.png"],
            size: "alto"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "NUEVO EPISODIO",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/ancho2.png"],
            size: "normal" 
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "Revista Venezuela Odontológica",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/ancho.png", "/assets/noticias/ancho2.png"],
            size: "ancho"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "NUEVO EPISODIO",
            description: "XLII Juegos Nacionales de Odontólogos TACHIRA 2024. Desde el domingo 28 de abril hasta el viernes 03 de mayo se celebraron los...",
            imageUrl: ["/assets/noticias/normal5.png"],
            size: "normal"
        },
        {
            date: "14/05/2024",
            time: "12:30pm",
            title: "PROYECTO DE ACTUALIZACIÓN DE LEY ORGÁNICA DE LA ODONTOLOGÍA",
            description: "Artículo 1. Objeto de la Ley. La presente Ley tiene por objeto establecer las bases...",
            imageUrl: ["/assets/noticias/alto.png", "/assets/noticias/alto.png"],
            size: "alto"
        },
    ];

    const curvedTitleStyle = {
        fontStyle: 'italic',
        transform: 'perspective(500px) rotateX(10deg)',
        textShadow: '0 4px 5px rgba(0,0,0,0.1)',
        paddingBottom: '10px',
        display: 'inline-block'
    };

    const generateGridLayout = (items) => {
        const grid = Array(6).fill().map(() => Array(3).fill(null));
        const itemPositions = {};

        items.forEach((item, index) => {
            const itemId = `card-${index + 1}`;
            let placed = false;

            for (let row = 0; row < grid.length && !placed; row++) {
                for (let col = 0; col < grid[0].length && !placed; col++) {
                    if (grid[row][col] === null) {
                        if (item.size === "normal") {
                            grid[row][col] = itemId;
                            itemPositions[itemId] = { row, col, rowSpan: 1, colSpan: 1 };
                            placed = true;
                        } else if (item.size === "ancho" && col < grid[0].length - 1 && grid[row][col + 1] === null) {
                            grid[row][col] = itemId;
                            grid[row][col + 1] = itemId;
                            itemPositions[itemId] = { row, col, rowSpan: 1, colSpan: 2 };
                            placed = true;
                        } else if (item.size === "alto" && row < grid.length - 1 && grid[row + 1][col] === null) {
                            grid[row][col] = itemId;
                            grid[row + 1][col] = itemId;
                            itemPositions[itemId] = { row, col, rowSpan: 2, colSpan: 1 };
                            placed = true;
                        }
                    }
                }
            }

            if (!placed) {
                const newRow = Array(3).fill(null);
                grid.push(newRow);

                if (item.size === "normal") {
                    grid[grid.length - 1][0] = itemId;
                    itemPositions[itemId] = { row: grid.length - 1, col: 0, rowSpan: 1, colSpan: 1 };
                } else if (item.size === "ancho") {
                    grid[grid.length - 1][0] = itemId;
                    grid[grid.length - 1][1] = itemId;
                    itemPositions[itemId] = { row: grid.length - 1, col: 0, rowSpan: 1, colSpan: 2 };
                } else if (item.size === "alto") {
                    grid[grid.length - 1][0] = itemId;
                    grid.push(Array(3).fill(null));
                    grid[grid.length - 1][0] = itemId;
                    itemPositions[itemId] = { row: grid.length - 2, col: 0, rowSpan: 2, colSpan: 1 };
                }
            }
        });

        let gridTemplateAreas = '';
        for (let row = 0; row < grid.length; row++) {
            gridTemplateAreas += '"';
            for (let col = 0; col < grid[0].length; col++) {
                gridTemplateAreas += (grid[row][col] || '.') + ' ';
            }
            gridTemplateAreas = gridTemplateAreas.trim() + '"\n';
        }

        return {
            areas: gridTemplateAreas,
            columns: "1fr 1fr 1fr",
            rows: `repeat(${grid.length}, auto)`
        };
    };

    const gridLayout = useMemo(() => {
        return generateGridLayout(newsItems);
    }, [newsItems]);

    return (
        <section>
            <div className="text-center">
                <h2 
                    className="text-[48px] font-extrabold text-center bg-gradient-to-br from-blue-400 to-blue-600 text-transparent bg-clip-text italic inline-block"
                    style={curvedTitleStyle}
                >
                    Noticias
                </h2>
            </div>
            <div className="container mx-auto mt-16">
                <div
                    className="grid"
                    style={{
                        gridTemplateAreas: gridLayout.areas,
                        gridTemplateColumns: gridLayout.columns,
                        gridTemplateRows: gridLayout.rows,
                        gap: "40px"
                    }}
                >
                    {newsItems.map((item, index) => (
                        <CardNoticias key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Noticias;