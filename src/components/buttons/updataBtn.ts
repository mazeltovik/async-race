import Component from '../../utils/component';
import CreateInput from '../inputs/createInput';
import CreateColorInput from '../inputs/createColorInput';
import './createCar.scss';
import ParagpraphGarageComponent from '../main-container/paragraphGarageComponent';
import DivComponent from '../main-container/divComponent';
import MainComponent from '../main-container/mainComponent';
type Body = {
    [key: string]: string;
};

export default class UpdateBtn<I extends unknown, C extends unknown> extends Component {
    text;
    constructor(
        public main: MainComponent<ParagpraphGarageComponent, DivComponent, CreateInput, CreateColorInput>,
        public communicationWith: [I, C],
        ...args: [string, string, string[]]
    ) {
        super(...args);
        this.text = 'Update';
    }
    render() {
        super.render();
        (this.elem as HTMLButtonElement).textContent = this.text;
    }
    getBody(): Body {
        let body = {
            name: (this.communicationWith[0] as CreateInput).name,
            color: (this.communicationWith[1] as CreateColorInput).color,
        };
        return body;
    }
    getId(): string {
        let id = (this.communicationWith[0] as CreateInput).id || (this.communicationWith[1] as CreateColorInput).id;
        return id;
    }
    findIndex(id: number): number {
        let findIndex = this.main.arrCars.findIndex((v) => {
            return v.id == id;
        });
        return findIndex;
    }
    async updateCar() {
        let res = await fetch(`http://127.0.0.1:3000/garage/${this.getId()}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.getBody()),
        });
        if (res.ok) {
            let car = await fetch(`http://127.0.0.1:3000/garage/${this.getId()}`);
            if (car.ok) {
                let jsonCar = await car.json();
                document.getElementById(`${jsonCar.id}`)!.querySelector('span')!.textContent = jsonCar.name;
                document.getElementById(`${jsonCar.id}`)?.setAttribute('color', jsonCar.color);
                this.main.arrCars[this.findIndex(jsonCar.id)].imgCar.render(jsonCar.color);
            }
        } else {
            console.log('Ошибка HTTP: ' + res.status);
        }
    }
    eventHandler() {
        this.elem.addEventListener('click', () => {
            this.updateCar();
        });
    }
}
