<script lang="ts">
  import { Plugboard } from "$lib/plugins/Plugboard";
  import { default as ReflectorsList } from "$lib/plugins/Reflector";
  import { Rotor, default as RotorsList } from "$lib/plugins/Rotor";

  /** The alphabet */
  const alphabet: string = "abcdefghijklmnopqrstuvwxyz";
  /** If the machine is active and can be used */
  let machineActive: boolean = false;
  /** If the machine was initialized with the right settings */
  let machineInitialized: boolean = false;
  /** The key pressed by the user */
  let currentKey: string = "";
  /** The user input's history */
  let pressedKeyHistory: string[] = [];
  /** The user ciphered keys */
  let cipheredKeyHistory: string[] = [];
  /** The plugboard*/
  const plugboard: Plugboard = new Plugboard();
  /** The letters in order */
  const plugboardLetters: string[] = ["qwertzuio", "asdfghjk", "pyxcvbnml"];
  /** The letters that have a connection */
  let pluggedLetters: string = "";
  /** The available reflectors */
  const { Reflectors } = ReflectorsList;
  /** The reflector used */
  let reflectorIndex: number = 0;
  /** The available rotors */
  const { Rotors } = RotorsList;
  /** The reflector used in the machine */
  let usedRotors: Rotor[] = [];

  /**
   * Initializing the key press event
   *
   * @param {KeyboardEvent} event The key event
   */
  const manageKeyPress = (event: KeyboardEvent) => {
    //only allowing one key press at a time
    if (event.repeat || !machineActive) return;

    let pressedKey = event.key.toLowerCase();

    if(!machineInitialized) usedRotors[0].changeSettings();
    machineInitialized = true;

    //changing the pressed key only if it is in the alphabet
    if (alphabet.includes(pressedKey)) {
      //the key to cipher
      let cipherKey: string;
      //keeping track of the current key and all the key pressed previously
      currentKey = cipherKey = pressedKey;
      pressedKeyHistory = [...pressedKeyHistory, currentKey];

      //first passing through the plugboard
      //then the rotors, after the reflector and after the rotors again
      //finishing by the plugboard again
      cipherKey = plugboard.swap(cipherKey);
      cipherKey = usedRotors[0].cipher(cipherKey, true, false);
      cipherKey = Reflectors[reflectorIndex].reflect(cipherKey);
      cipherKey = usedRotors[0].cipher(cipherKey, false, true);
      cipherKey = plugboard.swap(cipherKey);

      //adding the ciphered key to an array
      cipheredKeyHistory = [...cipheredKeyHistory, cipherKey];
    }
  };

  /**
   * Create the plugboard connections
   * Removing one letter from a connection will remove the whole connection
   *
   * @param {string} letter One of the letter of the connection
   */
  const manageConnections = (letter: string) => {
    //checking if the connection exists to either add or remove it
    let pluggedLetterIndex = pluggedLetters.indexOf(letter);
    if (pluggedLetterIndex !== -1) {
      //getting the connections that contains the letter
      let connection = plugboard.connections.filter((connection) => {
        if (connection.includes(letter)) {
          return connection;
        }
      });

      //getting the index of the connection that contains the letter
      if (connection.length > 0) {
        plugboard.connections.splice(
          plugboard.connections.indexOf(connection[0]),
          1
        );
      }

      //updating the pluggedLetters according to the plugboard connections
      pluggedLetters = plugboard.connections.join("");

      //returning to stop the function here
      return;
    }

    //adding letter to the pluggedLetters
    pluggedLetters += letter;
    //if the connections are paired we add them to the plugboard
    if (pluggedLetters.length % 2 === 0)
      plugboard.connections = pluggedLetters.match(/.{1,2}/g) || [];
  };

  /**
   * Check if the maximum amount of rotors in used is good
   * After the check we allow to use the machine and don't allow more rotor selection
   *
   * @param {Event} event The click event
   */
  const checkMaxRotors = (event: Event): void => {
    const rotorLimit: number = 3;

    if (usedRotors.length > rotorLimit) {
      //unchecking the fourth checkbox checked
      //@ts-ignore
      event.currentTarget.checked = false;

      return;
    }

    //activating the machine when there is three rotors
    usedRotors.length === rotorLimit
      ? (machineActive = true)
      : (machineActive = false);
    //passing the used rotors to the rotor class
    usedRotors.forEach((rotor: Rotor) => {
      rotor.usedRotors = usedRotors;
    });
  };
</script>

<svelte:window
  on:keydown={($event) => {
    manageKeyPress($event);
  }}
/>
<section class="enigma">
  <p>
    Press any key : {currentKey} <br />
    Your pressed keys : {pressedKeyHistory.join("")} <br />
    Your ciphered keys : {cipheredKeyHistory.join("")}
  </p>

  <div class="reflectors">
    {#each Reflectors as x, i}
      <input
        type="radio"
        bind:group={reflectorIndex}
        value={i}
        id={"reflector_" + i.toString()}
        hidden
      />
      <label
        for={"reflector_" + i.toString()}
        class:current={i === reflectorIndex}
        >Reflector {alphabet[i].toUpperCase()}</label
      >
    {/each}
  </div>

  <div class="rotors">
    {#each Rotors as rotor, i}
      <input
        type="checkbox"
        bind:group={usedRotors}
        value={rotor}
        id={"rotor_" + i.toString()}
        on:change={($event) => {
          checkMaxRotors($event);
        }}
      />
      <label for={"rotor_" + i.toString()}>Rotor {i}</label>
    {/each}
  </div>

  <div class="plugboard">
    {#each plugboardLetters as letterGroup}
      <div class="line">
        {#each letterGroup as letter}
          <span
            class="letter"
            role="button"
            tabindex="0"
            class:plugged={pluggedLetters.includes(letter)}
            on:click={() => {
              manageConnections(letter);
            }}
            on:keydown={() => {
              return;
            }}
          >
            {letter}
            <span class="port" />
          </span>
        {/each}
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  .enigma {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;

    .reflectors {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;

      label {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        margin: 15px;
        padding: 15px;
        width: 150px;
        font-size: 19px;

        transition: 0.15s;
        border: solid 1px black;
      }
      label:hover {
        background: rgb(230, 230, 230);
      }
      label.current {
        background: black;
        color: white;
      }
    }
    .plugboard {
      display: flex;
      flex-flow: column nowrap;

      border: solid 1px black;
      padding: 15px;
      width: 50%;

      .line {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;

        padding: 5px;

        .letter {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          font-size: 19px;

          width: 10%;

          &.plugged {
            .port {
              background: black;
            }
          }
          .port {
            height: 50px;
            width: 25px;
            background: none;
            border: solid 2px black;
          }
        }
      }
    }
  }
</style>
