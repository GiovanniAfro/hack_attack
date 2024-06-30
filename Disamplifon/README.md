# Disamplifon Team - Mecho: Enjoy the sound you love 🎼

Mecho è una web app innovativa progettata per migliorare l'esperienza sonora nelle smart city. L'app filtra i suoni circostanti in tempo reale, offrendo una personalizzazione dinamica per gli utenti. Con Mecho, puoi ridurre i rumori indesiderati, enfatizzare i suoni preferiti e creare soundscapes personalizzati per ogni attività.

### Documenti correlati

1. **Lean Model Canvas (Miro Board):** https://miro.com/app/board/uXjVK3byod0=/?share_link_id=9241471735
2. **Mecho Pitch Deck:** https://pitch.com/v/mecho-5bkhpz
3. **Mecho Figma Prototype:** https://www.figma.com/proto/VGb7ZUM0njvMviZ4fSnRrh/Mecho?node-id=116-2395&viewport=449%2C487%2C0.19&t=8Ex6r4O0NOMxoR2F-0&scaling=scale-down&content-scaling=fixed&starting-point-node-id=116%3A2609
3. **Mecho Video:** https://drive.google.com/file/d/1sBwLNB3UP4VcZoqi3g00rtt3zpmkvMmg/view?usp=sharing

### Descrizione Progetto
L'idea di base era quella di creare un'applicazione che permettesse di filtrare i suoni circostanti in tempo reale, sfruttando il principio dell'interferenza distruttiva. L'applicazione permette di ridurre l'esposizione a rumori molesti e di controllare il livello di esposizione a suoni elevati.

### Spiegazione del Fenomeno Fisico
L'interferenza distruttiva è un fenomeno fisico che si verifica quando due onde sonore si sovrappongono e si contrastano a vicenda. Perche' si possa verificare l'interferenza distruttiva totale, cioe' l'effetto che ci ponevamo di ottenere, le due onde sonore devono essere in controfase, cioe' avere la stessa ampiezza e frequenza, ma con una differenza di fase un numero dispari di volte mezza lunghezza d'onda. In questo modo, le onde sonore si annullano a vicenda, creando un effetto di silenzio.

## PoC 1

Nel primo PoC abbiamo sviluppato un prototipo funzionante dell'applicazione Mecho. Sono presenti due file audio di esempio, uno con un rumore di fondo e l'altro filtrato. In modo da dare un'idea di come l'applicazione potrebbe funzionare.

Dato lo scarso tempo a disposizione non siamo riusciti a completare l'intero progetto, il problema principale è stato non riuscire a trovare un algoritmo di interferenza distruttiva che funzionasse in tempo reale, perché, avendo due sorgenti audio da due dispositivi diversi, per riuscire a eliminare il rumore di fondo da una delle due, bisognerebbe che il suono in controfase fosse riprodotto con pochissima distanza dell'audio sorgente, per poter eliminare efficacemente i suoni fastidiosi. Ci sembrava una sfida troppo grande per il poco tempo ma poi abbiamo capito che dovevamo isolare un suono armonico, da cresta a cresta ad esempio, dal suono sorgente-controfase e andare a cercarlo nel file audio sorgente, da li in poi applicarlo nel corso dell'audio per eliminare il rumore di fondo restante. Per farvi immaginare meglio la cosa pensate a un programma che tenta di indovinare la password di un account, iterando le varie combinazioni possibili, solo che qui la password e' la controfase (immaginatevi sul grafico tot. creste d'onda di un suono armonico) che tenta di "fittare" (si parla di curve) un frammento dell'audio sorgente da pulire, e se corrisponde da quel minutaggio in poi si applica il filtro. Siamo ancora lontani dal fare tutto cio' in tempo reale, dall'annullare vari rumori di fondo e selezionare solo quello che ci interessa, ma il metodo potrebbe gettare le basi per un futuro sviluppo e siamo fieri di averlo realizzato.

 ```sh
   Il codice python "armonico.py" permette di filtrare i suoni armonici di un file audio, dato un file di input e un frammento in controfase del suono da eliminare. Il codice itera sul file audio "sporco" e lo pulisce dal suoni di fondo armonico come dimostrato nell'interfaccia web nella sezione laterale "Poc Mecho".
   ```

### Installazione ⚙️
1. **Clona la repository:**
   ```sh
   git clone https://github.com/jblackiex/Disamplifon.git
   cd Disamplifon
   ```

2. **Installa le dipendenze:**
   ```sh
   npm install
   ```

3. **Avvia il server:**
   ```
   make
   ```

4. **Visita l'app nel browser** 🌍
   ```
   http://localhost:1024
   ```

## PoC 2 - Prototype 🤖

Questo prototipo e' stato aggiunto a scopo illustrativo, dato che a causa di limitazioni di tempo, non siamo riusciti a fare un'adeguata implementazione.
E' stato utilizzato durante le fasi di sviluppo per ottenere chiarimenti sulla fattibilita' del progetto stesso.
L'idea era quella di riuscire ad isolare i rumori fastidiosi, per poi crearne una traccia in anti-fase da mandare al dispositivo del client, che avrebbe dovuto riprodurla per ridurre il volume di tali rumori tramite l'effetto dell'interferenza distruttiva.
Inizialmente questo prototipo avrebbe dovuto far parte del back-end e ripulire una traccia audio da potenziali rumori;
Idealmente sarebbe stato in grado di riconoscere i rumori e rimuoverli tramite l'utilizzo di una traccia in anti-fase.
Questo era troppo complesso da realizzare, per cui e' stato optato di svilupparne una versione che semplicemente potesse dimostrare tale concetto, senza la funzionalita' di riconoscere i rumori.
Alla fine e' stato utilizzata un altro metodo per dimostrare la nostra idea e questo prototipo riadattato come elemento stand-alone per mostrare l'andamento dello sviluppo.
Il prototipo possiede delle tracce audio sporche e dei file contenenti i rumori utilizzati per sporcarla, come risultato si ottiene una traccia abbastanza pulita dell'audio originale.

### Installazione
1. **Clona la repository:**
   ```sh
   git clone https://github.com/jblackiex/Disamplifon.git
   cd Prototype
   ```

2. **Installa le dipendenze:**
   ```sh
   ./dependencies.sh
   ```

3. **Avvia l'app:**
   ```sh
   node prototype.js samples/"sample_da_utilizzare" q(valore rappresentativo dei rumori utilizzati)
   ```
