import { DriverLap } from "./driver-lap.class";
import { DriverDto } from "../dto/DriverDto";
import { Race } from "@/app/video/classes/race.class";

export class Driver {
  constructor(
    public race: Race,
    public index: number,
    public name: string,
    public startKart: string,
    public laps: DriverLap[] = [],
  ) {}

  getKarts() {
    return this.laps.map((lap) => lap.kart).filter((kart, index, karts) => kart != karts[index + 1]);
  }

  addLaps(driverLaps: DriverLap | DriverLap[]) {
    driverLaps = Array.isArray(driverLaps) ? driverLaps : [driverLaps];
    this.laps = this.laps.concat(driverLaps);
  }

  getSortedLaps(): DriverLap[] {
    return [...this.laps].sort((a, b) => a.time - b.time);
  }

  toDto(): DriverDto {
    return {
      index: this.index,
      name: this.name,
      startKart: this.startKart,
      laps: this.laps.map((lap) => lap.toDto()),
    };
  }

  static fromDto(dto: DriverDto, race: Race) {
    const driver = new Driver(race, dto.index, dto.name, dto.startKart);
    const laps = dto.laps.map((lap) => DriverLap.fromDto(lap, driver));
    driver.addLaps(laps);
    race.processPitlane();
    return driver;
  }
}
