/**
 * The rotor class
 */
export class Rotor {
  /** The alphabet */
  private alphabet: string = "abcdefghijklmnopqrstuvwxyz";
  /** The rotor internal wiring  */
  public wiring: string;
  /** The rotor current position */
  private position: string = "abcdefghijklmnopqrstuvwxyz";
  /** The rotor turnover position */
  public turnover: string;
  /** The rotors used in the machine */
  public usedRotors: Rotor[] = [];
  /** The rotor's position setting */
  public rotorSetting: number = 0;
  /** The rotor's ring setting */
  public ringSetting: number = 0;

  /**
   *
   * @param {string} wiring The rotor wiring
   * @param {string} turnover The rotor turnover notch
   */
  constructor(wiring: string, turnover: string) {
    this.wiring = wiring;
    this.turnover = turnover;
  }

  /**
   * Changed the initial settings of the machine
   */
  changeSettings(): void {
    //changing the settings for all the rotors
    this.usedRotors.forEach((rotor: Rotor) => {
      //FIX CHANGE SETTINGS FUNCTION
    });
  }

  /**
   * Manage when to rotate or encrypt the letters
   *
   * @param {string} letter The letter en encrypt
   * @param {boolean} rotate If we rotate the rotors
   * @param {boolean} reverse If the input is coming from the opposite side
   * @returns {string} The encrypted letter
   */
  cipher(letter: string, rotate: boolean = false, reverse: boolean): string {
    //we first rotate the rotors
    if (rotate) this.manageRotation();

    //then we encrypt the letter and return it
    return this.encrypt(letter, reverse);
  }

  /**
   * Manage the rotation with the nothces of each rotors
   */
  manageRotation(): void {
    this.usedRotors.forEach((rotor: Rotor, index: number) => {
      if (index === 0) {
        this.rotate(rotor);
      } else if (
        this.usedRotors[index - 1].turnover ===
        this.usedRotors[index - 1].wiring[0]
      ) {
        this.rotate(rotor);
      }
    });
  }

  /**
   * Rotate the rotors by one step
   */
  rotate(rotor: Rotor): void {
    //get the characters that are changed when rotating
    let charactersPositionChanged = rotor.position.slice(0, 1);
    let charactersWiringChanged = rotor.wiring.slice(0, 1);
    //removing duplicate characters
    rotor.position = rotor.position.replace(charactersPositionChanged, "");
    rotor.wiring = rotor.wiring.replace(charactersWiringChanged, "");
    //appending the new character at the end
    rotor.position += charactersPositionChanged;
    rotor.wiring += charactersWiringChanged;
  }

  /**
   * Encrypt the letter based on the rotor wiring and position
   *
   * @param {string} letter The letter to encrypt
   * @param {boolean} reverse If the input is coming from the opposite side
   * @returns {string} The encrypted letter
   */
  encrypt(letter: string, reverse: boolean): string {
    if (reverse) {
      this.usedRotors
        .slice()
        .reverse()
        .forEach((rotor: Rotor) => {
          //getting the index in the alphabet
          let indexInAlphabet = this.alphabet.indexOf(letter);
          //getting the corresponding letter in the rotor position
          let letterInPosition = rotor.position[indexInAlphabet];
          //getting the index in the wiring of the letter in the rotor position
          let indexInWiring = rotor.wiring.indexOf(letterInPosition);
          //then getting the letter in the alphabet based on the index in the wiring
          letter = this.alphabet[indexInWiring];
        });
    } else {
      this.usedRotors.forEach((rotor: Rotor) => {
        //getting the index of the letter in the alphabet
        let indexInAlphabet = this.alphabet.indexOf(letter);
        //then getting the corresponding letter in the alphabet
        let letterInWiring = rotor.wiring[indexInAlphabet];
        //then getting index in the rotor position of the letter in the wiring
        let indexInPosition = rotor.position.indexOf(letterInWiring);
        //then getting the letter in the alphabet based on the index in the position
        letter = this.alphabet[indexInPosition];
      });
    }

    return letter;
  }
}

// All the available rotors
const Rotor1: Rotor = new Rotor("ekmflgdqvzntowyhxuspaibrcj", "q");
const Rotor2: Rotor = new Rotor("ajdksiruxblhwtmcqgznpyfvoe", "e");
const Rotor3: Rotor = new Rotor("bdfhjlcprtxvznyeiwgakmusqo", "v");
const Rotor4: Rotor = new Rotor("esovpzjayquirhxlnftgkdcmwb", "j");
const Rotor5: Rotor = new Rotor("vzbrgityupsdnhlxawmjqofeck", "z");

export default {
  Rotors: [Rotor1, Rotor2, Rotor3, Rotor4, Rotor5],
};
