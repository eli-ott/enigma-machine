<script lang="ts">
  import { Plugboard, ReflectorA } from "$lib/plugins";

  /** The plugboard*/
  let plugboard = new Plugboard();
  /** The alphabet */
  const alphabet: string = "abcdefghijklmnopqrstuvwxyz";
  /** The key pressed by the user */
  let currentKey: string = "";
  /** The user input's history */
  let pressedKeyHistory: string[] = [];
  /** The user ciphered keys */
  let cipheredKeyHistory: string[] = [];
  /** The letters in order */
  let plugboardLetters: string[] = ["qwertzuio", "asdfghjk", "pyxcvbnml"];
  /** The letters that have a connection */
  let pluggedLetters: string = "";

  /**
   * Initializing the key press event
   */
  const manageKeyPress = (event) => {
    //only allowing one key press at a time
    if (event.repeat) return;

    let pressedKey = event.key.toLowerCase();

    //changing the pressed key only if it is in the alphabet
    if (alphabet.includes(pressedKey)) {
      //the key to cipher
      let cipherKey: string;
      //keeping track of the current key and all the key pressed previously
      currentKey = cipherKey = pressedKey;
      pressedKeyHistory = [...pressedKeyHistory, currentKey];

      cipherKey = plugboard.swap(cipherKey);
      cipherKey = ReflectorA.reflect(cipherKey);
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
