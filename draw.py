import turtle
import math
import random
import time

# Screen setup
screen = turtle.Screen()
screen.bgcolor("black")
screen.tracer(0)

# Ball class
class Ball:
    def __init__(self, t):
        self.t = t
        self.theta = random.uniform(0, 2 * math.pi)
        self.speed = random.uniform(0.002, 0.005)  # SLOW speed

    def move(self):
        self.theta += self.speed

        # Infinity path
        a = 180
        x = a * math.sin(self.theta)
        y = a * math.sin(self.theta) * math.cos(self.theta)

        self.t.goto(x, y)

# Create balls
balls = []
for _ in range(15):
    t = turtle.Turtle()
    t.shape("circle")
    t.shapesize(0.5)
    t.color("cyan")
    t.penup()
    balls.append(Ball(t))

# Animation loop
while True:
    for ball in balls:
        ball.move()
    screen.update()
    time.sleep(0.04)  # slows everything down
