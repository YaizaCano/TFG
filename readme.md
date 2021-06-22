# Benvinguts al nostre sistema de reputació

Hola! Aquest projecte està dividit en 3 estructures diferents, amb els seus propis requisits i processos d'instal·lació. Aconsello fer git clone del repositori públic que es pot trobar a la web <https://github.com/YaizaCano/TFG>.
En cas de no voler, s'adjunten els arxius necessaris al zip.

## NodeJS

Per instal·lar totes les parts d'aquest projecte és necessari node.js i els seu administrador de paquets.

```bash
sudo apt install nodejs
sudo apt install npm
```

## Xarxa Blockchain

Per desplegar la nostra xarxa blockchain s'han de tenir en compte els següents passos.

### Hardhat

Instal·lem el software Hardhat.

```bash
npm install --save-dev hardhat
```

Compilem els smart contracts

```bash
npx hardhat compile
```

> Aquest pas és important tot i que les interaccions i els desplegaments els fem des de Remix degut a que el backend necessita saber l'abi, és a dir, l'estructura de les funcions, per poder cridar els mètodes.

Despleguem la xarxa.

```bash
npx hardhat node
```

### Metamask

Instal·lem el plug-in de Metamask al nostre navegador. Es pot trobar a la seva pàgina oficial: <https://metamask.io/>.

Un cop instal·lada li donarem a l'opció **Importar cartera**, acceptarem les condicions. Com a frase secreta afegirem **"test test test test test test test test test test test junk"**.

> Podem afegir qualsevol frase que volguem però aquesta és la *default* de Hardhat i és la que aquest projecte fa servir.

Per últim afegirem una contrasenya al gust de l'usuari.

Un cop realitzat el registre, escollirem la xarxa **Localhost 8545** a dalt a la dreta que és el port on està allotjada la xarxa de Hardhat.
També podrem importar comptes amb les claus privades que proporciona Hardhat un cop iniciem la xarxa com s'ha explicat a l'apartat anterior.

### Remix

Obrim la plataforma Remix al nostre navegador al link <https://remix.ethereum.org/>. Aquí pugem els dos fitxers que poden trobar al path **./blockchain/contracts** al directori **contracts** del Remix.

Un cop afegits, obrir el model amb el que volem interactuar, el compilem automàticament amb cntrl + s o accedint al segon icono al menú lateral **Solidity Compiler**. Si el codi s'ha compilat correctament, a l'icono esmentat es ficara un tic. El compilador que jo he utilitzat és el **0.8.4+commit.c7e474f2**.  

Un cop compilat, anem al tercer icono del menú lateral **Deploy & Run Transactions**. Aquí escollim al camp **environment** l'opció **Injected Web 3**. Aquest pas ens farà saltar el plug-in de Metamask on haurem d'introduir la contrasenya que li hem assignat anteriorment.
A partir d'aquí ja podem desplegar i interactuar amb els smart contracts compilats.

## Backend i Frontend

Pel backend i frontend és necessari executar la següent comanda als paths **./backend** i **./backend/client**.

```bash
npm install
```

Aquesta comanda instal·larà totes les despendències necessaries per executar l'aplicació.
Finalment, des de **./backend**, executar la següent comanda per aixecar tant el frontend com el backend.

```bash
npm run dev
```
