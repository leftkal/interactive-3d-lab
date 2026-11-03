const image = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const images = {
  interactiveArt: image('interactive-art.webp'),
  safePrinting: image('safe-printing.webp'),
  sensorFlow: image('sensor-flow.webp'),
  teamDesign: image('team-design.webp'),
}
