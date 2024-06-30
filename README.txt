Questo progetto nasce da una semplice idea che ci è venuta quando abbiamo sentito le tracce dell hack-attak,
una città smart e rumore.
A parere nostro una smart city non è per forza una città interconnessa, ma una città intelligente, nel vero
senso della parola, una città che pensa ai propri abitanti e gli aiuta. Ci siamo basati su un concetto che è
cresciuto insieme a noi, la semplicità, perché se c'è una cosa che abbiamo imparato stando al computer a 
a scrivere funzioni, espressioni, variabili e algoritmi è che per quanto la tua idea possa essere complessa
ed il programma lungo ed articolato, basta un misero punto e virgola a non far funzionare più niente.
Quindi non abbiamo puntato il dito all'innovazione del secolo, ma ci siamo messi a debuggare la città che ci
circonda, alla ricerca di quel dannato punto e virgola che in questo programma complesso ed articolato che 
chi l'ha programmata si è dimenticato di mettere. E voi che state leggendo vi starete chiedendo:

"Ma ragazzi, è impossibile che in questa città ci sia un mattoncino così importante che manca all'appello,
 la città sta andando avanti, 'il programma compila'. "

E noi vi diamo ragione, in quanto per noi, come per voi che state leggendo, scorrendo il programma che è la
nostra vita non ci rendiamo conto che il punto e virgola manca ma riusciamo comunque a compilare in qualche 
modo. Però vorremmo portare la vostra attenzione a chi compila in modo un po' diverso dal nostro, persone
al quale quel piccolo carattere in un programma di milioni di righe può portare ad un errore fatale, persone
a cui un rumore troppo forte, o una luce puntata negli occhi, o anche solo una cartaccia per terra può 
scaturire una reazione inaspettata e potenzialmente dannosa.

Noi con questo progetto puntiamo proprio a loro, per mettere un punto e virgola nella nostra città che 
permetta loro di compilare la propria vita in maniera serena, e viverla in maniera più tranquilla e cosciente
della bella città che li circonda.

Il nostro progetto ha come obiettivo quello di evidenziare in tempo reale quelle che sono le zone più rumorose
della città, permettendo di visualizzare facilmente su una mappa in rosso i luoghi dove sono stati registrati 
rumori troppo forti, di modo da evitarli e studiarsi un percorso con meno probabilità di subirne gli effetti.

In questo MVP ci siamo concentrati sulla visione che abbiamo più che sulle funzionalità, pertanto comprendiamo
che al netto di ciò che è stato fatto non sia un prodotto finito, però speriamo che comprendiate che un progetto
del genere necessita anche di risorse delle quali attualmente non disponiamo. L'idea, infatti, sarebbe stata 
quella di avere un server centrale che raccogliesse i dati in tempo reale, generando una mappa e permettendo di
visualizzare il percorso più silenzioso verso la nostra meta. Questo per ovvie ragioni di risorse e tempo non
siamo riusciti a farlo, e ci siamo limitati a farvi intuire nel pratico come sarebbe avere a disposizione un
servizio simile.



In quanto l'Api di google maps per fare ciò di cui  abbiamo bisogno è a pagamento ci siamo limitati ad usare
un'immagine statica delle mappe della nostra città, creando punti rossi nei luoghi in cui i rumori sono stati 
rilevati, mappando le coordinate reali dell'utente a punti sull'immagine. Per vostra comodità abbiamo impostato
la sensibilità del rilevamento dei rumori in modo tale da permettere ad un bel battito di mani di attivarlo.
Inoltre per farvi testare la mappa, dubitando che vi sposterete in tutta la città per fare rumore, abbiamo 
inserito un form che fa inserire latitudine e longitudine custom per far spuntare nuovi punti sulla mappa.
Ovviamente per utilizzarla si devono consentire notifiche, posizione ed accesso al microfono.

Lo script attualmente semplicemente salva le posizioni di rilevamento dei rumori forti in un array globale,
che va a simulare quello che in futuro è previsto essere un server, lo script del client è già organizzato di
modo da poter cambiare solo le 2 righe dell'upload e del download di questi dati per essere pronto a comunicare
con esso.

inoltre ci teniamo a precisare che i colori della pagina sono scelti con cura per disturbare il meno possibile
l'occhio di persone che soffrono di autismo, ci scusiamo se possono risultare di poco gusto, o banali, ma ci 
tenevamo a mantenere l'ottica del progetto improntata sull'aiutare il prossimo.

Per assicurarsi il funzionamento del sito, invece di aprirlo direttamente offline, consigliamo di simulare un
server sul localhost ed accedervi da lì.

Non omettiamo inoltre che questa versione di prova non è priva di bug, anzi, siamo sicuri che ci siano più bugs
che features, buon divertimento a trovarli!

Coordinate Massime e Minime di riferimento dell'immagine:

Latitudine Minima:  43.763781	Longitudine Minima:  11.228297
Latitudine Massima: 43.789967	Longitudine Massima: 11.281727

Per aprire il server abbiamo incluso un ambiente virtuale nella cartella che permette su macOS e linux di aprire
un server python. Per farlo basta aprire il terminale sulla cartella del progetto e scrivere:

source .venv/bin/activate

python -m http.server 8000 
o, in caso non si avesse l'alias
python3 -m http.server 8000

Questi due comandi permetteranno di usare l'ambiente virtuale come path e poi di attivare il server http sulla
porta 8000 del nostro localhost. Basterà poi andare sul browser 
(si consiglia chrome per il corretto funzionamento)
e digitare nella barra degli indirizzi
localhost:8000 per entrare nel sito.