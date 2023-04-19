/* eslint max-lines: ["warn", 275] */

import { World, type Sphere, type Body, Material, ContactMaterial, Vec3 } from "cannon-es";

import type { PaddleSide, PaddleMove, CollisionSide, PongState, WallSide } from "./@types";
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_WIDTH, BALL_RADIUS } from "./constants";
import { Ball } from "./ball";
import { Wall } from "./wall";
import { Paddle } from "./paddle";

// class PongModel => game's core => physics engine
export class PongModel {
  private world: World;
  private ball: Ball;
  private paddle: { [Side in PaddleSide]: Paddle<Side> };
  private wall: { [Side in WallSide]: Wall<Side> };

  private paddleContactMaterial: ContactMaterial;
  private wallContactMaterial: ContactMaterial;

  constructor() {
    /* INIT WORLD*/
    this.world = new World();
    this.world.gravity.set(0, 0, 0);

    /* MATERIALS */
    const paddlePhysMat = new Material();
    const wallPhysMat = new Material();

    /* INIT BALL */
    this.ball = new Ball();
    this.world.addBody(this.ball.body);

    /* INIT PADDLE */
    this.paddle = {
      left: new Paddle({
        side: "left",
        physMat: paddlePhysMat,
        pos: new Vec3(-GAME_WIDTH / 2 + PADDLE_WIDTH * 2.5, 0, 0),
      }),
      right: new Paddle({
        side: "right",
        physMat: paddlePhysMat,
        pos: new Vec3(GAME_WIDTH / 2 - PADDLE_WIDTH * 2.5, 0, 0),
      }),
    };
    for (const paddle of Object.values(this.paddle)) {
      this.world.addBody(paddle.body);
    }

    /* INIT WALLS */
    this.wall = {
      left: new Wall({
        side: "left",
        shape: new Vec3(2 * BALL_RADIUS, GAME_HEIGHT, 2 * BALL_RADIUS),
        physMat: wallPhysMat,
        pos: new Vec3(-GAME_WIDTH / 2 - BALL_RADIUS, 0, 0),
      }),
      right: new Wall({
        side: "right",
        shape: new Vec3(2 * BALL_RADIUS, GAME_HEIGHT, 2 * BALL_RADIUS),
        physMat: wallPhysMat,
        pos: new Vec3(GAME_WIDTH / 2 + BALL_RADIUS, 0, 0),
      }),
      top: new Wall({
        side: "top",
        shape: new Vec3(GAME_WIDTH, 2 * BALL_RADIUS, 2 * BALL_RADIUS),
        physMat: wallPhysMat,
        pos: new Vec3(0, GAME_HEIGHT / 2 + BALL_RADIUS, 0),
      }),
      bottom: new Wall({
        side: "bottom",
        shape: new Vec3(GAME_WIDTH, 2 * BALL_RADIUS, 2 * BALL_RADIUS),
        physMat: wallPhysMat,
        pos: new Vec3(0, -GAME_HEIGHT / 2 - BALL_RADIUS, 0),
      }),
    };
    for (const wall of Object.values(this.wall)) {
      this.world.addBody(wall.body);
    }

    /* Init paddleContactMaterial */
    this.paddleContactMaterial = new ContactMaterial(this.ball.physMat, paddlePhysMat, {
      friction: 0,
      restitution: 1,
      contactEquationStiffness: 1e6,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e6,
      frictionEquationRelaxation: 3,
    });
    this.world.addContactMaterial(this.paddleContactMaterial);

    /* Init wallContactMaterial */
    this.wallContactMaterial = new ContactMaterial(this.ball.physMat, wallPhysMat, {
      friction: 0,
      restitution: 1,
      contactEquationStiffness: 1e6,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e6,
      frictionEquationRelaxation: 3,
    });
    this.world.addContactMaterial(this.wallContactMaterial);
  }

  public initRound(round: number): void {
    this.ball.initRound();
    this.paddle.left.initRound();
    this.paddle.right.initRound();
  }

  public update(deltaTime: number): void {
    // deltaTime /= 1000;
    this.world.step(1 / 60, deltaTime, 3);
  }

  public detectCollisions(): Body[] {
    const collisions: Body[] = [];
    const contactEquations = this.world.contacts;
    for (let i = 0; i < contactEquations.length; i++) {
      const contact = contactEquations[i];
      const bodyA = contact.bi;
      const bodyB = contact.bj;
      if (!collisions.includes(bodyA)) {
        collisions.push(bodyA);
      }
      if (!collisions.includes(bodyB)) {
        collisions.push(bodyB);
      }
    }

    return collisions;
  }

  public detectMissedCollision(): CollisionSide {
    const ballPosition = this.ball.body.position;
    const ballRadius = (this.ball.body.shapes[0] as Sphere).radius;

    if (ballPosition.x < this.wall.left.body.position.x + ballRadius) {
      return "left";
    } else if (ballPosition.x > this.wall.right.body.position.x - ballRadius) {
      return "right";
    }

    return "none";
  }

  public detectWallCollision(): CollisionSide {
    const contacts = this.world.contacts;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (contact.bi === this.ball.body && contact.bj === this.wall.left.body) {
        return "left";
      } else if (contact.bi === this.ball.body && contact.bj === this.wall.right.body) {
        return "right";
      }
    }

    return "none";
  }

  public updatePaddle(side: PaddleSide, move: PaddleMove): void {
    if (side === "right") {
      this.paddle.right.move(move);
    } else if (side === "left") {
      this.paddle.left.move(move);
    }
  }

  public getState(): PongState {
    return {
      ball: this.ball.getState(),
      paddleRight: this.paddle.right.getState(),
      paddleLeft: this.paddle.left.getState(),
    };
  }

  // public set() {}

  public paddleLastMove(paddleSide: PaddleSide): PaddleMove {
    if (paddleSide === "right") {
      return this.paddle.right.lastMove;
    }

    return this.paddle.left.lastMove;
  }
}
