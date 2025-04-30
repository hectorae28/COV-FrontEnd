const newsItems = [
    {
        id: 1,
        title: "Congreso Nacional de Odontología 2023",
        date: "15 de Octubre, 2023",
        time: "09:30 AM",
        imageUrl: "/images/news/congreso.jpg",
        description:
            "El Congreso Nacional de Odontología 2023 reunirá a los mejores especialistas del país para discutir los avances más recientes en el campo. Este evento imperdible tendrá lugar en Caracas y contará con talleres prácticos, conferencias y oportunidades de networking.",
        category: "Conferencias",
        fullContent:
            "El Congreso Nacional de Odontología 2023 reunirá a los mejores especialistas del país para discutir los avances más recientes en el campo. Este evento imperdible tendrá lugar en Caracas y contará con talleres prácticos, conferencias y oportunidades de networking.\n\nEste año, el congreso se enfocará en cuatro áreas principales: implantología avanzada, odontología digital, estética dental y gestión de consultorios. Los asistentes podrán elegir entre más de 30 sesiones especializadas impartidas por ponentes nacionales e internacionales.\n\nEntre los ponentes destacados se encuentran el Dr. Luis Ramírez, reconocido por sus innovaciones en técnicas de implantes dentales; la Dra. María González, especialista en odontología digital y flujos de trabajo CAD/CAM; y el Dr. Carlos Mendoza, referente en restauraciones estéticas de mínima invasión.\n\nAdemás de las conferencias, el evento ofrecerá una amplia exposición comercial donde los asistentes podrán conocer las últimas tecnologías, equipos y materiales disponibles en el mercado odontológico.\n\nLa inscripción temprana está disponible con descuentos especiales para miembros de asociaciones odontológicas y estudiantes. El evento contará con certificación de horas académicas válidas para recertificación profesional.",
        location: "Hotel Renaissance, Caracas",
        organizer: "Asociación Venezolana de Odontología",
        contactInfo: "congreso@avo.org.ve | +58 212-555-1234",
        registrationLink: "https://www.avo.org.ve/congreso2023",
    },
    {
        id: 2,
        title: "Nuevas técnicas de implantología dental",
        date: "10 de Octubre, 2023",
        time: "14:00 PM",
        imageUrl: "/images/news/implantologia.jpg",
        description:
            "Descubre las técnicas más innovadoras en implantología dental que están revolucionando la práctica odontológica. Estos avances permiten procedimientos menos invasivos y tiempos de recuperación más cortos para los pacientes.",
        category: "Actualización",
        fullContent:
            "La implantología dental ha experimentado avances significativos en los últimos años, transformando por completo la manera en que se abordan los casos complejos y mejorando sustancialmente la experiencia del paciente.\n\nEntre las técnicas más innovadoras se encuentra la implantología guiada por computadora, que permite una planificación digital completa del caso mediante tomografía computarizada y software especializado. Esta técnica permite colocar implantes con una precisión milimétrica, reduciendo el tiempo quirúrgico y las complicaciones postoperatorias.\n\nOtra innovación destacable es la técnica de carga inmediata, que permite al paciente salir de la consulta con dientes provisionales el mismo día de la colocación de los implantes, eliminando el periodo de espera tradicional de 3-6 meses.\n\nLos nuevos biomateriales también están revolucionando el campo, con superficies de implantes tratadas que promueven una mejor osteointegración y reducen el tiempo de cicatrización. Los implantes de zirconio han surgido como una alternativa a los tradicionales de titanio, ofreciendo excelentes resultados estéticos en la zona anterior.\n\nLas técnicas de regeneración ósea guiada con membranas reabsorbibles y factores de crecimiento derivados de plaquetas están permitiendo realizar implantes en áreas con deficiencia ósea que antes requerían procedimientos más invasivos o eran consideradas no aptas para implantes.\n\nEstos avances no solo han ampliado el abanico de posibilidades terapéuticas, sino que han democratizado el acceso a tratamientos implantológicos al reducir costos y tiempos de tratamiento.",
        author: "Dr. Eduardo Martínez",
        authorCredentials:
            "Especialista en Implantología Oral, Universidad Central de Venezuela",
        sources: [
            "Journal of Oral Implantology, 2023",
            "International Journal of Oral & Maxillofacial Implants, 2022",
        ],
    },
    {
        id: 3,
        title: "Podcast: El futuro de la odontología digital",
        date: "5 de Octubre, 2023",
        time: "10:15 AM",
        imageUrl: "/images/news/podcast.jpg",
        description:
            "Escucha nuestro nuevo episodio de podcast donde expertos discuten cómo la tecnología digital está transformando la odontología moderna, desde escáneres intraorales hasta impresión 3D de prótesis.",
        category: "Podcast",
        fullContent:
            "En este episodio de nuestro podcast 'Odontología al Día', abordamos en profundidad cómo la revolución digital está transformando todos los aspectos de la práctica odontológica moderna.\n\nNuestros invitados, el Dr. Andrés Rojas (especialista en prostodoncia digital) y la Dra. Valentina Suárez (pionera en implementación de flujos digitales en clínicas), comparten sus experiencias implementando estas tecnologías y analizan su impacto en la precisión diagnóstica, la comunicación con el paciente y la eficiencia de los tratamientos.\n\nDurante la conversación, exploramos las ventajas de los escáneres intraorales frente a las impresiones convencionales, destacando no solo la comodidad para el paciente sino también la mayor precisión y la posibilidad de compartir archivos instantáneamente con laboratorios. Los doctores también discuten cómo la tecnología CAD/CAM ha revolucionado la fabricación de restauraciones, permitiendo materiales más estéticos y resistentes.\n\nUn segmento fascinante del episodio está dedicado a la impresión 3D y sus múltiples aplicaciones en odontología: desde guías quirúrgicas para implantes hasta modelos de estudio y prototipos de restauraciones. Los expertos coinciden en que esta tecnología está democratizando el acceso a tratamientos de alta calidad al reducir costos y tiempos de producción.\n\nFinalmente, se analiza el futuro cercano de la odontología digital, con inteligencia artificial para diagnóstico automatizado, realidad aumentada para planificación de tratamientos y biomateriales imprimibles personalizados según la biología de cada paciente.",
        episodeNumber: "Episodio 42",
        duration: "58 minutos",
        hostName: "Dra. Gabriela Peralta",
        guests: [
            "Dr. Andrés Rojas - Especialista en Prostodoncia Digital",
            "Dra. Valentina Suárez - Directora Clínica Dental Futuro",
        ],
        audioLink: "https://odontologiaaldia.podbean.com/ep42",
    },
    {
        id: 4,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 5,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 6,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 7,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 8,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 9,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 10,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 11,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
    {
        id: 12,
        title: "Revista Odontológica - Nueva edición disponible",
        date: "1 de Octubre, 2023",
        time: "08:00 AM",
        imageUrl: "/images/news/revista.jpg",
        description:
            "Ya está disponible la nueva edición de nuestra revista científica con artículos de investigación, casos clínicos y revisiones bibliográficas. Accede a contenido exclusivo y mantente actualizado con las últimas tendencias.",
        category: "Revista",
        fullContent:
            "Nos complace anunciar el lanzamiento del volumen 45, número 3 de la Revista Venezolana de Odontología Científica, correspondiente al trimestre julio-septiembre 2023.\n\nEsta edición presenta una selección rigurosa de artículos científicos revisados por pares que abarcan diversas especialidades odontológicas, reflejo del compromiso continuo de nuestra publicación con la excelencia y la evidencia científica.\n\nEntre los artículos destacados de este número se encuentra una investigación original sobre la efectividad comparativa de diferentes protocolos de irrigación en endodoncia, conducida por investigadores de la Universidad de Los Andes. El estudio aporta evidencia significativa sobre la eliminación de biofilm bacteriano en conductos radiculares complejos.\n\nTambién presentamos una innovadora serie de casos clínicos sobre rehabilitación oral mínimamente invasiva con carillas de disilicato de litio ultrafinas, documentando protocolos de adhesión y resultados a 5 años.\n\nLa sección de revisión sistemática incluye un análisis exhaustivo sobre los factores de riesgo asociados a la periimplantitis, sintetizando evidencia de 78 estudios y ofreciendo recomendaciones clínicas basadas en los hallazgos más recientes.\n\nComo novedad, incluimos una sección especial dedicada a la investigación odontológica en Venezuela, con entrevistas a investigadores destacados y análisis de las publicaciones nacionales con mayor impacto internacional durante el último año.\n\nLa revista está disponible en formato digital para todos los miembros de la Sociedad Venezolana de Odontología y puede adquirirse individualmente a través de nuestra plataforma en línea.",
        volume: "Vol. 45, No. 3 (2023)",
        editor: "Dr. Roberto Blanco",
        issn: "ISSN 0718-5391",
        accessLink: "https://revista.svo.org.ve/actual",
        featuredArticles: [
            "Efectividad comparativa de protocolos de irrigación en endodoncia - Dra. Martínez et al.",
            "Rehabilitación con carillas ultrafinas: serie de casos a 5 años - Dr. López et al.",
            "Factores de riesgo en periimplantitis: revisión sistemática - Dra. Rodríguez et al.",
        ],
    },
];

export default newsItems;
