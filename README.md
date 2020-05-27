# Multiboard for Trello
A project management web application which allows you to see all your list and cards from different Trello boards in one place. Provides bi-directional synchronization using Trello API and Trello Webhooks.

You can see project running [here](http://www.trello-multiboard.com/).
Any feedback about project, code, any impovements ideas are highly appreciated! 

  [Contact me via mail here.](mailto:khouby3@gmail.com?subject=[MutliboardForTrello])

## Build With
* [React](https://reactjs.org/) - Frontend
* [Node.js](https://nodejs.org/en/) and [Express.js](https://expressjs.com/) - HTTP server
* [lowdb](https://github.com/typicode/lowdb) - simple JSON database
* [socket.io](https://socket.io/) - real-time communication between client and server
* [Trello API](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)
and lot more...

## Features currently supported

* Selecting boards to be shown
* List related action:
	* Creating lists
	* Moving lists around on board
* Card related actions:
	* Creating cards
	* Moving cards within list or to another list
	* Title and description update
	* Labels - selecting, creating, editing and deleting
	* Checklists - creating, creating from source, editing, same for checklist items
	* Due Date
	* Move, Copy, Archive and Delete
* Most of Webhook actions

More to come... if you want to see any other features from Trello being supported, [let me know.](mailto:khouby3@gmail.com?subject=[MutliboardForTrello])


## Running locally

Clone repository

    git clone https://github.com/xstefa22/multiboard-for-trello

Edit config.js file located in client/src folder

    server: //Here goes your server address, for example: http://localhost:3001
    
    onlyClient: false // Set to true, if you don't want to receice Trello Webhook updates
    
    webhookCallbackURL: // /update route for server address, use service like ngrok when running locally with onlyClient option set to false

  Finally install all dependencies, build and run

    npm install
    npm run start
   
   ## Licence
   This project is licensed under the MIT License - see [LICENSE](https://github.com/valmisson/Trellu/blob/master/LICENSE) for more information.
