kaboom({
    global: true,
    scale: 1,
    fullscreen: true,
    debug: true,
});

const MIN_RAND = 50
const MAX_RAND = 1980
const JUMP_FORCE = 200
let SPEED_FORCE = 200
const FALL_DEATH = 1000
let levelGlobal =  0
let scoreGlobal = 0
const WINDOW_WIDTH = window.screen.width
const WINDOW_HEIGHT = window.screen.height
console.log(WINDOW_WIDTH, WINDOW_HEIGHT)



loadSprite("iceman", "./assets/iceman.png");
loadSprite("tile-single", "./assets/Tiles/tile_0000.png")
loadSprite("tile-left", "./assets/Tiles/tile_0001.png")
loadSprite("tile-center", "./assets/Tiles/tile_0002.png")
loadSprite("tile-right", "./assets/Tiles/tile_0003.png")
loadSprite("block", "./assets/Tiles/tile_0004.png")
loadSprite("coin-front", "./assets/Tiles/tile_0151.png")
loadSprite("coin-side", "./assets/Tiles/tile_0152.png")
loadSprite("door", "./assets/Tiles/tile_0150.png")
loadSprite("player", "./assets/Characters/character_0000.png")
loadSprite("player-walk", "./assets/Characters/character_0001.png")
loadSprite("bomb", "./assets/Characters/character_0008.png")
loadSprite("bg", "./assets/Background/background_0000.png")
loadSprite("cloud-top", "./assets/Background/background_0001.png")
loadSprite("cloud-center", "./assets/Background/background_0002.png")
loadSprite("cloud-bottom", "./assets/Background/background_0007.png")
loadSprite('pipe', "./assets/Tiles/tile_0095.png")

class Bomb {
    constructor() {
        this.x = Math.random() * (MAX_RAND - MIN_RAND - 100) + MIN_RAND - 100
        this.y = 250
    }
    get bomb() {
        return this.createBomb()
    }
    createBomb() {
        return add([
            sprite('bomb'),
            pos(this.x, this.y),
            body(),
            scale(2),
            'bomb',
            'enemy',
            'danger',
            solid(),
            {
                flipped: false
            }
        ])
    }
}


class Coin {
    constructor() {
        this.x = Math.random() * (MAX_RAND - MIN_RAND) + MIN_RAND
        this.y = 250
    }
    get coin() {
        return this.createCoin()
    }
    createCoin() {
        return add([
            sprite('coin-front'),
            pos(this.x, this.y),
            body(),
            scale(2),
            'coin',
            solid(),
            {
                flipped: false
            }
        ])
    }

}


scene("game", ({scoreGlobal,levelGlobal}) => {
    console.log(`GAME -> score:`,scoreGlobal,`level:`,levelGlobal)
    const maps = [
        [
            '',
            '',
            '',
            '                                             ',
            '                                             ',
            '                     <_>                     ',
            '      p     &                            d   ',
            '                                      <__>   ',
            '     <___>                                   ',
            '              <>                             ',
            '        b                 <______>           ',
            '                                             ',
            '      &   <__________>  &                    ',
            '                                <____>       ',
            '                             <_________>     ',
            '   <________________________________________>',
        ],
        [
            '',
            '',
            '',
            '                       p                     ',
            '                                             ',
            '                                             ',
            '                                             ',
            '                                             ',
            '     <___>                                   ',
            '              <>    <______>               d ',
            '        b                            <______>',
            '  <______>                         <______>  ',
            '                 <>               <______>   ',
            '                                <____>       ',
            '                             <_________>     ',
            '   <________________________________________>',
        ],
        [
            '',
            '',
            '',
            '               d                             ',
            '               <>                            ',
            '                   <>              <______>  ',
            '                        <>                   ',
            '                    <>             <______>  ',
            '     <___>                                   ',
            '              <>                             ',
            '        b           <____>       <__________>',
            '  <______>               <>                  ',
            '                 <>                          ',
            '                                 <___>       ',
            '                             <_________>     ',
            '   <________________________________________>',
        ]

    ]
    const levelCfg = {
        width: 40,
        height: 40,
        '<': [sprite('tile-left'), solid(), scale(2.5), 'tile'],
        '>': [sprite('tile-right'), solid(), scale(2.5), 'tile'],
        '_': [sprite('tile-center'), solid(), scale(2.5), 'tile'],
        '&': [sprite('tile-single'), solid(), scale(2.5), 'tile'],
        '$': [sprite('coin-front'), solid(), scale(2), 'coin'],
        '%': [sprite('coin-side'), solid(), scale(2), 'coin'],
        'b': [sprite('bomb'), solid(), scale(1.5), 'bomb', 'danger'],
        'p': [sprite('iceman'), solid(), scale(1), body(), 'iceman', 'princes'],
        'd':[sprite('door'),solid(),scale(2),'door']

    }
    const bg = addSprite("bg", {
        width: width(),
        height: height(),
        layer: 'bg'
    });
    const player = add([
        sprite('player'),
        pos(110, 0),
        body({
            // force of .jump()
            jumpForce: 500,
            // maximum fall velocity
            maxVel: 2400,
        }),
        solid(),
        'player',
        scale(2),
        {
            speed: 240,
            dead: false,
        }
    ]);
    // const bombs = [new Bomb().bomb]
    const coins = [new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin, new Coin().coin]
    const scoreLabel = add([
        text(scoreGlobal),
        pos(300, 50),
        layer('bg'),
        scale(1.5),
        color(0, 0, 0, 1),
        {
            value: scoreGlobal,
        },
    ])
    const levelLabel = add([
        text('level ' + +(levelGlobal+1)),
        pos(50, 50),
        layer('bg'),
        scale(1.5),
        color(0, 0, 0, 1)
    ])
    player.collides("iceman", () => {
        add([
            sprite('coin-front'),
            scale(1),
            pos(vec2(50, 50)),
            origin('center'),
            solid()
        ])
        go('win',{scoreGlobal,levelGlobal})
    });
    player.action(() => {
        // camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', {scoreGlobal,levelGlobal})
        }
    })
    player.collides('coin', (c) => {
        scoreGlobal++
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
        destroy(c)
    })
    player.collides('door',(d)=>{
        d.destroy()
        player.destroy()
        camShake(12)
        levelGlobal++
        go('game',{scoreGlobal,levelGlobal})
    })
    collides('player', 'tile', (p, t) => {
        p.changeSprite('player')
    })
    setInterval(() => {
        flippCoin(coins)
    }, 200);

    addLevel(maps[levelGlobal], levelCfg)
    keyControllers(player)

});

scene("lose", ({scoreGlobal,levelGlobal}) => {
    // console.log(`LOSE -> score:`,score,`level:`,level)
    console.log(`LOSE->`,scoreGlobal,levelGlobal)

    layers(['bg'], 'bg')

    const bg = addSprite("bg", {
        width: width(),
        height: height(),
        layer: 'bg'
    });
    add([
        text(`lose`),
        pos(width() / 2, height() / 2),
        scale(10),
        color(0, 0, 0, 1),
        origin('center')
    ])
    add([
        text('to play again press "a"'),
        pos(width() / 2, height() / 4),
        color(0, 0, 0, 1),
        scale(2),
        origin('center')

    ])
    add([
        text('score:' + scoreGlobal),
        pos(width() / 2, height() / 6),
        origin('center'),
        color(0, 0, 0, 1),
        scale(2)
    ])
    add([
        text('level:' +levelGlobal),
        pos(width() / 2, height() / 10),
        origin('center'),
        color(0, 0, 0, 1),
        scale(2)
    ])
    keyDown('a', () => {
        go("game",{scoreGlobal:0,levelGlobal:0})
    })
})


scene("win", ({scoreGlobal,levelGlobal}) => {
    console.log(`WIN -> score:`,scoreGlobal,`level:`,levelGlobal)

    layers(['bg'], 'bg')
    const bg = addSprite("bg", {
        width: width(),
        height: height(),
        layer: 'bg'
    });
    add([
        text(`win`),
        pos(width() / 2, height() / 2),
        scale(10),
        color(0, 0, 0, 1),
        origin('center'),

    ])
    add([
        text('to play again press "a"'),
        pos(width() / 2, height() / 3),
        color(0, 0, 0, 1),
        scale(2),
        origin('center'),

    ])
    add([
        text('score:' + scoreGlobal),
        pos(width() / 2, height() / 6),
        color(0, 0, 0, 1),
        scale(2),
        origin('center'),
    ])
    add([
        text('level:' +levelGlobal),
        pos(width() / 2, height() / 10),
        origin('center'),
        color(0, 0, 0, 1),
        scale(2)
    ])
    keyDown('a', () => {
        go("game",{scoreGlobal:0,levelGlobal:0})
    })
})

function flippCoin(coins) {
    coins.forEach(coin => {
        coin.flipped = !coin.flipped
        return coin.flipped ? coin.changeSprite('coin-front') : coin.changeSprite('coin-side')
    })
}

// Key controllers
function keyControllers(player) {

    keyDown('left', () => {
        if(keyIsDown(`control`)){
            player.move(-SPEED_FORCE*2, 0)
        }
        player.changeSprite('player-walk')
        player.move(-SPEED_FORCE, 0)
        player.dir = vec2(-1, 0)
    })
    keyDown('right', () => {
        if(keyIsDown(`control`)){
            player.move(SPEED_FORCE*2, 0)

        }
        player.changeSprite('player-walk')
        player.move(SPEED_FORCE, 0)
        player.dir = vec2(1, 0)
    })
    keyPress("up", () => {
        if (player.grounded()) {
            player.changeSprite('player-walk')
            player.jump();
            player.dir = vec2(0, 0)
        }
    });
    keyPress("space", () => {
        if (player.grounded()) {
            player.changeSprite('player-walk')
            player.jump();
            player.dir = vec2(0, 0)
        }
    });
}


go("game",{scoreGlobal,levelGlobal});