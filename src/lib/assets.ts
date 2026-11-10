const image = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const images = {
  labSculpture: image('lab-sculpture.svg'),
  logo: image('interactive-3d-lab-logo.webp'),
  printedForm: image('printed-form.svg'),
  sensorNetwork: image('sensor-network.svg'),
}
