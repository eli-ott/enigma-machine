<script lang="ts">
  import { onMount } from "svelte";
  import { Plugboard } from "$lib/plugins";

  /** The plugboard*/
  let plugboard = new Plugboard();
  /** The alphabet */
  let alphabet: string = "abcdefghijklmnopqrstuvwxyz";
  /** The key pressed by the user */
  let currentKey: string = "";
  /** The user input's history */
  let pressedKeyHistory: string[] = [];
  /** The user ciphered keys */
  let cipheredKeyHistory: string[] = [];
  /** The letters in order */
  let plugboardLetters: string[] = ["qwertzuio", "asdfghjk", "pyxcvbnml"];
  /** A single connection on the plugboard */
  let connection: string = "";
  /** The connections of the plugboard */
  let connections: string[] = [];
  /** The letters that have a connection */
  let pluggedLetters: string = "";

  /**
   * On mount
   */
  onMount(() => {
    initKeyPress();
  });

  /**
   * Initializing the key press event
   */
  const initKeyPress = () => {
    window.addEventListener("keydown", (event) => {
      //only allowing one key press at a time
      if (event.repeat) return;

      let pressedKey = event.key.toLowerCase();

      //changing the pressed key only if it is in the alphabet
      if (alphabet.includes(pressedKey)) {
        //keeping track of the current key and all the key pressed previously
        currentKey = pressedKey;
        pressedKeyHistory = [...pressedKeyHistory, currentKey];

        //adding the ciphered key to an array
        cipheredKeyHistory = [
          ...cipheredKeyHistory,
          plugboard.swap(currentKey),
        ];
      }
    });
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
      plugboard.connections.splice(
        plugboard.connections.indexOf(connection[0]),
        1
      );

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
              manageConnections(letter);
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
