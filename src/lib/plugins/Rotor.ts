/**
 * The rotor class
 */
export class Rotor {
  private alphabet: string = "abcdefghijklmnopqrstuvwxyz";
  /** The wiring of the rotor */
  protected wiring: string;
  /** The turnover position */
  protected turnover: string;
  /** The list of rotors used */
  public rotorsUsed: Rotor[] = [];
  /** The list of the ring setting of each rotor used */
  public rotorsSettings: number[] = [0, 0, 0];
  /** The starting position of each rotor used */
  public rotorPosition: number[] = [0, 0, 0];
  /** If the machine was initialized with the right settings and position */
  private initialized: boolean = false;

  /**
   * The constructor
   *
   * @param {string} wiring The wiring of the rotor
   * @param {string} turnover The turnover position of the rotor
   */
  constructor(wiring: string, turnover: string) {
    this.wiring = wiring;
    this.turnover = turnover;
  }

  /**
   * Cipher the letters according to the input letter and rotate them one time
   *
   * @param {string} letter The letter to cipher
   * @param {boolean} rotation If the rotors have to rotate
   * @returns {string} The ciphered letter
   */
  public cipher(letter: string, rotation: boolean = false): string {
    if (!this.initialized) {
      //changing the encryption of each rotors
      this.changeEncryption();
      //setting the machine as initialized after the first encryption setting
      this.initialized = true;
    }
    if (rotation) {
      //rotating each rotor before encypting them
      this.manageRotation();
    }

    //encrypting the letter after the rotation and returning the encrypted letter
    return this.encrypt(letter);
  }

  /**
   * Change the encryption of each rotors based on the settings and position
   */
  private changeEncryption(): void {
    this.rotorsUsed.forEach((rotor, index) => {
      //changing the rotor wiring depenging on the settings
      rotor.wiring = rotor.wiring
        .split("")
        .map((letter) => {
          let newWiring = "";
          //changing each wiring letter with the next one in the alphabet
          if (this.alphabet.indexOf(letter) !== 25) {
            newWiring =
              this.alphabet[
                this.alphabet.indexOf(letter) + this.rotorsSettings[index]
              ];
          } else {
            newWiring = this.alphabet[0];
          }

          return newWiring;
        })
        .join("");

      //rotating the rotor according to its initial rotor position
      for (let i = 0; i < this.rotorPosition[index]; i++) {
        this.manageRotation();
      }
    });
  }

  /**
   * Rotate the wiring
   */
  private rotate(rotor: Rotor) {
    //the characters that have been rotated
    let rotatedCharacters = rotor.wiring.slice(0, 1);
    //removing the rotated characters to put them at the end of the string
    rotor.wiring = rotor.wiring.replace(rotatedCharacters, "");
    rotor.wiring += rotatedCharacters;
  }

  /**
   * Rotate the rotors according on their positions and their turnover
   */
  private manageRotation(): void {
    this.rotorsUsed.forEach((rotor, index) => {
      //rotation the rotor wiring by one based on the rotor rotation
      if (!this.initialized) {
        this.rotate(rotor);

        return;
      }

      //if it is the first rotor we always rotate it
      if (index === 0) {
        this.rotate(rotor);
      } else {
        console.log(rotor.wiring, index);
        //then for the other rotor we check the turnover position to rotate them at the right time*
        if (
          this.rotorsUsed[index - 1].turnover ===
          this.rotorsUsed[index - 1].wiring[0]
        ) {
          console.log(
            "rotating",
            this.rotorsUsed[index - 1].wiring,
            this.rotorsUsed[index - 1].turnover
          );
          this.rotate(rotor);
        } else {
          return;
        }
      }
    });
  }

  /**
   * Encrypt the letter based on the rotated
   *
   * @param {string} letter The letter to encrypt
   * @returns {string} The encrypted letter
   */
  private encrypt(letter: string): string {
    this.rotorsUsed.forEach((rotor) => {
      let indexInAlphabet: number = this.alphabet.indexOf(letter);

      letter = rotor.wiring[indexInAlphabet];
    });

    return letter;
  }
}

// All the available rotors
const Rotor1 = new Rotor("ekmflgdqvzntowyhxuspaibrcj", "q");
const Rotor2 = new Rotor("ajdksiruxblhwtmcqgznpyfvoe", "e");
const Rotor3 = new Rotor("bdfhjlcprtxvznyeiwgakmusqo", "v");
const Rotor4 = new Rotor("esovpzjayquirhxlnftgkdcmwb", "j");
const Rotor5 = new Rotor("vzbrgityupsdnhlxawmjqofeck", "z");

export default {
  Rotors: [Rotor1, Rotor2, Rotor3, Rotor4, Rotor5],
};
