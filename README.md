# My Calendar

## Main Objectives

-   Avoid re-Schedule events or events that can't happen at the same time.
-   Schedule primary activities (learning, practicing, etc).
-   Separate a minimun time for my hobbies, laissure activities and social life.

## Secondary Objectives

-   Schedule secondary activities with the rest of the time.
-   Schedule commuting time

## Event vs Task

event : pass even thought you aren't there
task : you can do it in a period of time

### Priority System

1.  Assure main objectives (#1,#2,#3)
2.  Schedule commuting time and backup time if necessary
3.  Overlap activities I'm able to do while commuting (like metacognition or read)
4.
5.  Move the main activities as they best fit.
6.  Schedule the secondary activities in the remaining time
    fifth check: Check that #7 had the neceesary time along the week or in the day.
    final check: shorten the main activities if #7 needs it to and the rest of the time for the secondary activities.

### Hierachie of Priorities

##### 0. Mine and University's events (must be there events)

    Description
    	Commuting:x from last location
    	early:x time to be in the event before it starts
    	returnHome:x time to go home
    	commuteAfter:x hour to start commuting
    	commuteBefore:x hour to end commuting
    	compatible:[array of activities]

##### 1. Physiological needs (sleeping and taking a bath)

3 types of event:

-   Sleeping time

    -   condition: must be at home

-   Meals

    -   Breakfast
    -   Lunch
    -   Dinner

    Description

    -   commuting : x time
    -   mealAfter : x time
    -   mealBefore : x time
    -   compatibleWith : [array of events],[array of activities]

-   Personal Care

    -   condition: must be at home
    -   wash my teeth
    -   wash my hair
    -   take a bath

    Description

    -   doBefore : specific time
    -   doAfter : specific time
    -   compatibleWith : [array of events],[array of activities]

##### 2. Commuting time and backup time (tisme to go somewhere or return home)

Description

-   compatibleWith: [array of activities]

if an event can happen during other event of lower or higher Priority, must end in +#Priority-number

notification: you got no event right know, will you come home?
Yes - in half an hour - in an hour - before X time (specify the maximum hour)

##### 3. Exercise

3 types of exercise routine:

-   push up & back
    Condition:
    -   be at home
-   legs & abs
    Description
    -   andCommuting:bool (multiply the next event commuting time by 1.5)
    -   andReturningHome:bool (multiply the return commuting time by 1.5)
-   pull up & chest
    Condition:
    -   be at home

General Preferences:

-   before studying

##### 4. Metacognition & Planning

Priority: Must happen

Frequency

-   twice a day
-   every day

When

-   After Waking up
-   Before going to bed

Can be done while

-   Commuting
-   Any event in Meal Calendar

4 Activities

-   daily (night, accompanied by another one)
-   yesterday (day, accompanied by another one)
-   week ago
-   month ago

##### 5. Main Activities

Priority: Must happen
When: variable
Longs: depending on the remaining time and the minimum time for my Hobbies and Leisure
Activities

-   Studying what I already know and homework (> 120 min)
-   Research more the university topics (>90 min)
-   E-learning(90 - 180 min, interruptible)
-   Learn and practice another language (long time, needs preparation and not interruptible)
-   Learn and code (1h at least, Interruptible if it's longer than that)
-   Home Duties
    -   daily
        -   Feed the pets (task, no reminder needed)
        -   Help mom in something (wash the dishes, etc) (30 min at least)
    -   Weekly
        -   Sweep and mop the second floor (30 min)
        -   Clean pet poop (task, reminder needed)
    -   Occasionally
        -   Water the plants in my balcony (every 5 days)
        -   Walk the dog (two or three times a week)

##### 6. Hobbies and Leisure

######weekly minimum time: 300 min
######daily minimum time: 15 min

Activities:

-   Watch a movie (90 - 180 min)
-   Watch an anime or series episode (20 - 30 minutes)
-   Read a Book (5 minutes?, fits whenever I schedule it)
-   Draw (15 min at least)
-   Paint (30 min at least)
-   Write (45 min at least)

##### 7. Secondary Activities

-   Investigate
-   Make Diagrams
-   Document my projects
-   Social Media Production
-   Watch news
