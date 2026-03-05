today we're going to be talking about prompt engineering, uh and then as a result of that we're going to be talking about context engineering. And in this workshop um at the end I'm just gonna yap for a little bit, um while asking you guys a few questions uh and then you are going to practice doing exactly the moves and mechanics you'll do in your next assignment, which is to generate love songs, uh but we're going to be generating sonnets.
**[13:36:15 --> 13:36:35]** **3-A:**  So you guys probably saw that in the demos, that Sonnet was kind of the theme. We're gonna continue that, just because the songs are slightly different, we still want you guys to be making interesting choices. Uh but by the end of the day, you guys are gonna create like a system or sequence uh for generating sonnets, uh which you can use to kind of build up your skills uh to help you generate love songs.
**[13:36:36 --> 13:36:38]** **3-A:**  And the core of this
**[13:36:38 --> 13:37:05]** **3-A:**  is pretty basic. Uh we sent kind of an anthropic link, and then there was that front end with a demo. So it's totally okay if you guys didn't get through both of those. I know that was a lot of information. Uh but let's just talk about prompting. So really quickly, can anyone and this is like very low stakes, low pressure, can anyone describe to me really quickly, uh what prompting is? Like when you think about prompting, what do you think prompting kind of constitutes?
**[13:37:07 --> 13:37:07]** **3-A:**  Yep.
**[13:37:13 --> 13:37:22]** **3-A:**  Yes. Open your right input right. Yes, that's that first input that eventually goes into an output. That's a great way to think about it. Hey, come on in. Don't
**[13:37:22 --> 13:37:22]** **3-C:**  worry. Yes.
**[13:37:22 --> 13:37:26]** **3-A:**  Take a seat. There's like a few seats over here. Maybe a few back there. And we can get
**[13:37:26 --> 13:37:26]** **3-C:**  Yeah.
**[13:37:26 --> 13:37:27]** **3-A:**  more chairs. No, you're good.
**[13:37:28 --> 13:37:37]** **3-A:**  Uh anyone else for prompting? Just what you think of in terms of prompting. It could be what it is functionally, what it is
**[13:37:37 --> 13:37:38]** **3-A:**  materially
**[13:37:40 --> 13:37:42]** **3-A:**  there's no wrong answers. I know, big class.
**[13:37:45 --> 13:37:47]** **3-A:**  Just stare at you all, yes.
**[13:37:47 --> 13:37:53]** **3-D:**  I'll offer like a sentence which is like the point of prompting is to try and obtain like the desirable result that you want to see.
**[13:37:53 --> 13:37:54]** **3-A:**  Okay, yeah.
**[13:37:57 --> 13:37:59]** **3-A:**  So for a result
**[13:38:00 --> 13:38:04]** **3-A:**  is really great. Really quickly, what is a prompt made of?
**[13:38:16 --> 13:38:22]** **3-A:**  Alright, branching off of this, what makes a good prompt? Maybe we can get a few more things there. What do you guys think of prompting? Yeah?
**[13:38:25 --> 13:38:25]** **3-A:**  Yeah.
**[13:38:29 --> 13:38:30]** **3-A:**  Parameters, I saw a few other hands, yeah?
**[13:38:33 --> 13:38:33]** **3-A:**  Mmm.
**[13:38:35 --> 13:38:39]** **3-A:**  So clear. What else for good, what's good prompting?
**[13:38:39 --> 13:38:41]** **3-E:**  Um the bow of specificity.
**[13:38:41 --> 13:38:42]** **3-A:**  Yeah.
**[13:38:44 --> 13:38:48]** **3-A:**  a certain level of specificity and really quickly like w
**[13:38:49 --> 13:38:52]** **3-A:**  what would you say is a good level of specificity? Do you have anything there?
**[13:38:57 --> 13:38:57]** **3-A:**  Yeah.
**[13:38:57 --> 13:39:05]** **3-D:**  I would say you don't want to constrain it too much that it only gives you the exact words you want. But you also don't want to be too ambiguous that it goes out of the way.
**[13:39:05 --> 13:39:06]** **3-A:**  Okay yeah.
**[13:39:08 --> 13:39:09]** **3-A:**  So it's
**[13:39:09 --> 13:39:12]** **3-A:**  What say um I'll say task dependent
**[13:39:14 --> 13:39:34]** **3-A:**  to wrap that all together alright. So this is kind of a level of what prompting is. What you guys are hinting at though, which I really love, so again you guys have input. Um it's related to the task. It has something that's clear and has parameters and someone said very specifically to obtain a result.
**[13:39:35 --> 13:39:57]** **3-A:**  So to make things really clear, there's lots of guides on prompting, that entropic guide is really amazing uh in this thing it's it's constantly evolving. But it's essentially really good kind of clear communication. When you boil it down, prompting is just putting a string in in order to get a string out.
**[13:39:58 --> 13:40:00]** **3-A:**  That is the essence of what large language models

## Chunk 4

**[13:40:03 --> 13:40:17]** **4-A:**  So the goal here is to get as clear or good a string or a specific a string as you can. And this is a string made up of tokens. So this wasn't in your reading, but can anyone tell me what a token is?
**[13:40:23 --> 13:40:30]** **4-A:**  Yeah, units of meaning. So these things tend to vary dependent on the model between a word or sometimes parts of a word.
**[13:40:31 --> 13:40:54]** **4-A:**  Uh and these are transformed on the back end to like number codes. So it's like eight six seven five. And these can get up into like the hundreds of thousands. So it's not individual words. It's not individual characters. It tends to be something in between. Uh the tokenisation is not done by a person, it's done by an algorithm to kind of chew through text really efficiently.
**[13:40:54 --> 13:40:57]** **4-A:**  So it's just a string of tokens in, a stream
**[13:40:57 --> 13:41:14]** **4-A:**  a string of tokens out and that gets transformed into language on the back end. So when you have a conversation though with artificial intelligence, what's happening is you're adding to this operation. You get an input, you get an output,
**[13:41:15 --> 13:41:22]** **4-A:**  but let's say you ask that one shot, generate me a sonnet. It gets transformed into numbers, tokens.
**[13:41:23 --> 13:41:31]** **4-A:**  In the AI, it tries to produce tokens to answer. So it tries to produce tokens that formulate a sonnet.
**[13:41:32 --> 13:41:41]** **4-A:**  But let's say you get that sonnet and you go uh I don't really like this. Can you please explain to me why in the sonnet you outputted,
**[13:41:42 --> 13:41:44]** **4-A:**  you had this specific line.
**[13:41:45 --> 13:41:48]** **4-A:**  Now you need to have a conversation. You need to add
**[13:41:50 --> 13:42:11]** **4-A:**  The m kind of it's not quite memory, but now you're saying you know your question is here. Hey, what's up with this line? And you copy and paste this line. When you get that next A_I_ output, that answer, it needs to not just have your question, it needs to have everything that's happened in the conversation so far.
**[13:42:12 --> 13:42:23]** **4-A:**  So we joke like when you work uh with kind of developer tools or really early um L_L_M_s, you didn't have this ability, unless you manually copy and pasted inputs and outputs all together.
**[13:42:23 --> 13:42:49]** **4-A:**  and these movies might be too old for you, but you know we talk about memento as a movie, fifty first dates, in which case the people whose memory gets wiped every single day is kind of like the L_L_M_ You need to re-describe to it every single day, every single interaction, every single chat, what's going on, who you are. Um another version is uh Groundhog Day, in which uh it's not an individual person that's the L_L_M_ but the
**[13:42:49 --> 13:42:56]** **4-A:**  but the entire world. Only one person is holding memory and he has to kind of keep going back and explaining it over and over again.
**[13:42:57 --> 13:43:07]** **4-A:**  So this is a very difficult task to have to, oh, copy and paste everything. So you guys don't have to do this, obviously. When you are in a nice little chat window,
**[13:43:08 --> 13:43:11]** **4-A:**  what happens is so I'm just gonna make this little
**[13:43:14 --> 13:43:15]** **4-A:**  kind of border.
**[13:43:15 --> 13:43:41]** **4-A:**  So let's say please generate me a sonnet as your output, and let's be honest, it's probably not gonna be the sonnet, it's gonna be like interesting question. Very fascinating, thank you for that. Oh I'm gonna think about that. It'll give you a sonnet, maybe it'll say this is perfect for anything you're using your sonnet for. Valentine's d you know etcetera. Um and then you go oh, I hate it actually. And then it goes that's totally fair.
**[13:43:42 --> 13:44:05]** **4-A:**  I understand. Uh so you can have this back and forth, but what we want you guys to start to conceptualize is these aren't discrete interactions. You're slowly building up something and that something is context. Now you don't have unlimited runway with these conversations. With most models, you have two hundred K_ tokens.
**[13:44:05 --> 13:44:24]** **4-A:**  So again I'm gonna keep using tokens and think it's like somewhere between characters and words. It's not exactly that. Uh but it's about the length that you say like it's t in almost approximate to words. Just think you have about the length of a novel to have a conversation with artificial intelligence.
**[13:44:24 --> 13:44:36]** **4-A:**  And this is where we have a lot of technical people in here, but we also have a lot of humanities people. Like what better kind of method to think through interactions with A_I_ than you have the space of a novel. And all of you can think in those terms.
**[13:44:38 --> 13:44:48]** **4-A:**  Alright, so when you have your two hundred K tokens though, and you're in a playground, let's say you're in Gemini or in chat G_P_T_ Uh this isn't the full story.
**[13:44:50 --> 13:44:52]** **4-A:**  When you begin a conversation
**[13:44:52 --> 13:44:56]** **4-A:**  Actually some of your context is already taken.
**[13:44:57 --> 13:45:09]** **4-A:**  Usually about 10K tokens. And what this is made up of is kind of a strange mix of the system prompt
**[13:45:11 --> 13:45:20]** **4-A:**  and then maybe some other artefacts saved across your chats 'cause they want to have some consistency of who you are as a person. Maybe you've saved who you are and where you work and what your name is.
**[13:45:21 --> 13:45:21]** **4-A:**  So
**[13:45:21 --> 13:45:46]** **4-A:**  Let's talk about that system prompt. System prompts are kind of weird. Um so system prompts, there is the training that goes into the model, but then every company has their own specific system prompt. So this is the literal system prompt from Claude. Claude is one of the companies, um Anthropic is one of the companies that publishes their system prompt. And I know it's a bit small, but if folks who are nearby can see it, I want you guys to do a bit of close reading.
**[13:45:46 --> 13:46:02]** **4-A:**  This is about three pages into the system prompt, and I want you to make note that choices are being made for you that you don't even see. So can anyone just highlight a choice that they're seeing? And there's many pages, and I'll hand this out later,
**[13:46:02 --> 13:46:08]** **4-A:**  but just on this one page, what are some choices that are being made about your eventual textual output. Yeah.
**[13:46:13 --> 13:46:14]** **4-A:**  Friendly, appropriate.
**[13:46:15 --> 13:46:21]** **4-A:**  Yes, let's see. So talking with a minor. Friendly age appropriate.
**[13:46:22 --> 13:46:22]** **4-A:**  Yeah.
**[13:46:26 --> 13:46:27]** **4-A:**  Yes. Warm tone, yeah.
**[13:46:28 --> 13:46:38]** **4-A:**  I think it's funny like specifically restrict the use of emojis because it's like be judicious about them, but like casual to use them for really excessive emoji use.
**[13:46:38 --> 13:46:39]** **4-A:**  Yes. So
**[13:46:40 --> 13:47:07]** **4-A:**  You can imagine this is a slightly reactive document. In fact it's an inherently reactive document. Some of this is related to the s the the soul document you may have heard of which are kind of the ethicists saying how the A_I_ should act. But a lot of this, you see these incremental little choices that come from other users saying I kind of hate this thing. And so it's going through and saying ah like no emojis. People hate emojis. Please don't do it.
**[13:47:07 --> 13:47:29]** **4-A:**  Uh so I'm gonna hand this out. But that is something you also have to contend with. And I highly recommend looking at these system prompts and looking at the structure of these system prompts, because there can be this concept that everything here is a black box that you have this shiny U_I_ you've never done code, it feels like this magical device. But really down to its bones, it is text.
**[13:47:29 --> 13:47:55]** **4-A:**  And working with t text is precisely what you're doing in this course. So I know we guys like we're teaching you coding, but remember the base truth the core of everything is text which you guys are very well equipped to deal with. Alright, so let's say alright you you do have this system prompt which you don't control. You have this conversation it responds. You have this conversation it responds. Uh uh
**[13:47:55 --> 13:48:02]** **4-A:**  But look at what is happening here in terms of ratio. This is not to scale of course, really it would be like all the way down here, but
**[13:48:04 --> 13:48:09]** **4-A:**  The information you are making decisions about is about this big.
**[13:48:11 --> 13:48:20]** **4-A:**  Every let's say let's say that's about 10k tokens. But with the A_I_ with A_I_ is providing is much larger.
**[13:48:22 --> 13:48:49]** **4-A:**  I'm saying again not to scale. It's about like thirty K tokens. So you're giving a lot of agency to the L_L_M_ here in terms of its system prompt, but also mostly what's being generated post system prompt. The system prompt is kind of the most deterministic thing. Now this is very silly. We were doing this morning coming up with like a metaphor. So bear with me, but I have a little flowery bar. So imagine this whole thing is your context window.
**[13:48:50 --> 13:49:05]** **4-A:**  When you only put in a little bit that you've decided for yourself, I promise I won't spend anyone, uh but it's so weak and wobbly and whomp whomp, it's hallucinating. You're going all over the place. You're like, no please, I beg of you, go in this direction, and it's just
**[13:49:13 --> 13:49:39]** **4-A:**  to have like a physical uh metaphor for this, but the more context you add that you know is strong that you know you've made, you can do things with it. So you can say more cleanly hello, this is all of my context, this is all of the information I know what's in here. And I know every single element of this context window is something I approve. As a result it's much more likely to say lastu, this little guy, it might kill him of course, but
**[13:49:40 --> 13:49:40]** **4-A:**  I
**[13:49:40 --> 13:49:46]** **4-A:**  I guess that's the gamble we're all making with AI at the end of the day. Uh but it's much better than having an itty bitty little bit
**[13:49:47 --> 13:50:00]** **4-A:**  and expecting it to do high level operations, 'cause this is just the average of the internet guys. Need to remember what it's trained on is Reddit threads and Facebook mom group chats. And I guess for Anthropic

## Chunk 5

**[13:50:01 --> 13:50:08]** **5-A:**  a bunch of books that they literally cut in half like an abattoir in bed. But it's very
**[13:50:09 --> 13:50:24]** **5-A:**  not determined by you, so try to add as much context as you can. So let's look at this again. You only have let's say you're putting in a little bit and you're getting a lot out. How can we reverse this? How can we say
**[13:50:26 --> 13:50:29]** **5-A:**  get this much good context?
**[13:50:29 --> 13:50:40]** **5-A:**  that you approve of and like. And maybe you're only gonna ask the L_L_M_ to output the smallest thing possible. I want you to use all of this good context to make something really finite.
**[13:50:42 --> 13:50:57]** **5-A:**  That is something that again is kind of done for you automatically. Because writing let's say ten to thirty K_ tokens is hard. Some of you guys have written uh papers. Like what's the longest paper someone in here has written? Not you, you don't count.
**[13:50:59 --> 13:51:00]** **5-A:**  Like what's the longest paper by word?
**[13:51:00 --> 13:51:00]** **5-B:**  Yeah.
**[13:51:02 --> 13:51:06]** **5-A:**  Thirteen thousand words exactly, and how long did that take you manually typing?
**[13:51:08 --> 13:51:11]** **5-B:**  Well, it lets you do what it wants, probably like for a special day.
**[13:51:12 --> 13:51:16]** **5-A:**  Yeah, exactly, and that's if you're just doing it like it's already all the thoughts been done.
**[13:51:16 --> 13:51:27]** **5-A:**  So you don't have time for that really often. So then what happens is you get these things called thinking models. So how many people have used a thinking model uh before just in like a chat window?
**[13:51:28 --> 13:51:52]** **5-A:**  Yes, huzzah. Alright, so for the uninitiated, what is the thinking model? What happens is, you get back into that window and you say generate me a sonnet, but I'm going to click a button that says thinking. And I want you to think very hard. Of course it's not thinking more, you know, it's not putting more of its brain into making a sonnet.
**[13:51:53 --> 13:51:54]** **5-A:**  Instead what's happening
**[13:51:55 --> 13:52:21]** **5-A:**  is first your prompt goes to an LLM that has some context on what a plan should be. So this LLM goes hmm generate a sonnet, very good I see. Uh maybe let's say in the style of William Shakespeare. So it thinks and goes ah what do I need to get this done? So let me break this into tasks. Maybe first I'm going to look in my training data for what even is a sonnet.
**[13:52:22 --> 13:52:28]** **5-A:**  And I'm gonna get that out textually what's the form? Then I'm gonna look at my training data and say who even is William Shakespeare?
**[13:52:29 --> 13:52:38]** **5-A:**  And then I'm gonna look and say what's maybe some sonnets that I can look at for some imagery. So it's gonna pull text and it's gonna turn it into individual tasks.
**[13:52:38 --> 13:52:44]** **5-A:**  But again, you have no agency over this. What's happening is then all of this information is being turned into a plan.
**[13:52:45 --> 13:52:48]** **5-A:**  Then this information gets into a nice little package.
**[13:52:49 --> 13:53:17]** **5-A:**  That context package then goes to the L_L_M_ and boop, here you go, here's your sonnet, and it took a few more minutes. But all you're seeing in the playground is this interaction. Sometimes it gives you a thinking report that you can open and you'll kinda see the steps of this. But you can't intervene in the chat window, you can't say, ah no, I don't want you to use that sonnet for instance. So you're kind of giving again that control away, but that's what thinking is.
**[13:53:18 --> 13:53:22]** **5-A:**  Now thinking can have, you know a few other steps actually let me put this up.
**[13:53:24 --> 13:53:44]** **5-A:**  Let's say the L_L_M_ makes a plan for generate me a sonnet. And it keeps asking what is a sonnet. Okay well it has this many lines, and it has this rhyming scheme. But maybe it's a bit concerned, especially if you ask for something like a song, which you eventually will, which have lots of different formats. So maybe it wants to be a bit more deterministic.
**[13:53:44 --> 13:54:10]** **5-A:**  And says you know what I need? I don't just need to look at my training data and make a bunch of different LLCM calls individually and put them together. What I need to do is I need to call in my tools. And it depends. It doesn't always call the right tools. Again, this is very much dependent on this plan. But tools tend to be things like code. So maybe if you say I want you to make a song or a sonnet just like this.
**[13:54:10 --> 13:54:19]** **5-A:**  It might make a python script that can read how many lines are exactly in this thing they copy and pasted using deterministic code.
**[13:54:21 --> 13:54:35]** **5-A:**  It might say oh I don't even know what this is or who wrote it if you just copy and paste this on it, so maybe I'm gonna use web search and try to search the internet. And that's another code tool that's deterministic. And then it's gonna return those web searches.
**[13:54:35 --> 13:54:44]** **5-A:**  as more content. So that is what tool calling is. But again, you don't get to make any of these decisions.
**[13:54:46 --> 13:54:48]** **5-A:**  All of this though is prompt chaining.
**[13:54:48 --> 13:54:57]** **5-A:**  And that's what we want you guys to do in order to make your sonnets today and eventually to make your songs. But we don't want you to just rely on
**[13:54:58 --> 13:55:10]** **5-A:**  the corporations and their decisions of what would actually uh be beneficial for you to see. Uh so I'm gonna show you guys a few different things.
**[13:55:14 --> 13:55:16]** **5-A:**  When it comes to things like this
**[13:55:16 --> 13:55:34]** **5-A:**  So let's say there's a few text operations. Even if you do this at the highest level, say code, you're not saying generate me a sonnet, but you're saying make me a front-end website, and there's all these complexities. I don't want you guys to be worried that you cannot do them because I promise you can. Simply because all of this again is made of text.
**[13:55:35 --> 13:55:42]** **5-A:**  This is the instruction manual for a tool called compacting. And
**[13:55:42 --> 13:56:08]** **5-A:**  and quad code. So any of you who are like very tied into the A_I_ space, you know quad code is kind of taking over the world. It has all these different tools and scales. Those tools are defined textually. What this does is it compacts information to make you more room in your context window. So let's say you're getting close to that two hundred K_ tokens, it goes uh-oh, I'm gonna run out of memory here in the middle of this operation, I need to crunch this down. It literally reviews this document. And I'll pass this around later.
**[13:56:09 --> 13:56:19]** **5-A:**  But this is just a summary. And a lot of people actually take issue with this summary. Where is that? Um this is probably too small to see. Um but again,
**[13:56:20 --> 13:56:40]** **5-A:**  Engineers, humans and AI probably wrote this document and people have complaints. For instance someone here in a red thread said it summarizes the thread so far based on what it thought were the important parts. You can guide it with a customised prompt, but it's still like taking a novel and having a bored middle schooler write a three page double spaced book report on it.
**[13:56:41 --> 13:56:42]** **5-A:**  Which of you look through here is the case?
**[13:56:43 --> 13:57:08]** **5-A:**  So again, you can rely on these tools when it comes to something at the industry standard. But also when they have become a lot of different tools you have to move through, they also form indexes. So I'm just gonna keep driving home, you guys even if you've never done code before, you all have the ability to construct things like this, because you've all written a paper before. You can make a good recipe or a good instruction doc, you can make a good index.
**[13:57:08 --> 13:57:12]** **5-A:**  And this happens even at the industrial scale. So let's talk about prompt chaining.
**[13:57:13 --> 13:57:17]** **5-A:**  Uh and that is what you guys will be doing today. Uh now
**[13:57:18 --> 13:57:37]** **5-A:**  something that happens like with that text document, and we're just gonna talk about industry, 'cause again guys this is all new. Everything I'm referencing is like a few months old. So you're not behind. We're really trying to get you guys on the forefront. When you're in industry, so say you're producing code for a software company or your company that needs to make like a call centre bot.
**[13:57:38 --> 13:57:58]** **5-A:**  What you're going to do is you're gonna pull from a few different sources when you're making your prompt chain. We're gonna make this concrete in a moment. Um but the first is probably text, uh then let's say sources or resources and then tools and operations.
**[13:58:01 --> 13:58:02]** **5-A:**  This
**[13:58:02 --> 13:58:23]** **5-A:**  As an example, this compaction doc is an example of somewhere between text and a tool in operation. Can anyone just come up with ideas for what you think industries tend to use? Like what are the sources of information when you're trying to again, all you're trying to do is create really strong context.
**[13:58:25 --> 13:58:30]** **5-A:**  So if you are a company and you're trying to get to some kind of output,
**[13:58:31 --> 13:58:46]** **5-A:**  let's say a customer interaction, where a customer is called in and they need something, and you need to get to some kind of output, what are the things that might you might wanna feed into this context window? And we won't talk about how you get there, but what what's some things that you might need? Yeah.
**[13:58:50 --> 13:58:58]** **5-A:**  Yes. So you'll have a policy document. So that's something in like the text or sources zone. Anyone else?
**[13:59:05 --> 13:59:06]** **5-A:**  So consumer data.
**[13:59:07 --> 13:59:14]** **5-A:**  Um and this might come from a database, it could be a string, what else.
**[13:59:14 --> 13:59:15]** **5-A:**  Yeah.
**[13:59:15 --> 13:59:22]** **5-B:**  You know when you create a system, they say that we might use this to train a network system, do they take this into consideration?
**[13:59:23 --> 13:59:27]** **5-A:**  Yes. So probably past training, so let's say transcripts.
**[13:59:28 --> 13:59:33]** **5-A:**  So that's a kind of textual source of transcripts of all the times they used to have human callers.
**[13:59:41 --> 13:59:41]** **5-A:**  Yeah.
**[13:59:43 --> 14:00:00]** **5-A:**  Exactly. So that's something in kind of that code zone so it has the ability kind of agentically to push buttons, say take operations like deleting data or looking for an order. This is perfect guys. Exactly. Exactly exactly. So I'll just really quickly write a little example.

## Chunk 6

**[14:00:01 --> 14:00:06]** **6-A:**  what you were thinking. So but just to make it look like the same kind of operation.
**[14:00:08 --> 14:00:10]** **6-A:**  So yeah a customer comes in
**[14:00:13 --> 14:00:21]** **6-A:**  and they're you know they get on the front line and maybe let's just say their prompt is something as simple as a name. It's just like who are you? And we're also gonna record this.
**[14:00:23 --> 14:00:32]** **6-A:**  First, it'll undoubtedly go to some sort of plan. And that plan might be infused with what you were saying, like kind of cus like common customer service interactions.
**[14:00:34 --> 14:00:41]** **6-A:**  Uh but probably the first thing it'll be like, okay these are the different things we need. So let's go to the tool call area. It might query the database
**[14:00:42 --> 14:00:50]** **6-A:**  with for information on that customer related to that name. So what's all the orders you ever made? And let me retrieve that.
**[14:00:53 --> 14:01:06]** **6-A:**  Then you're probably gonna have some policy documents more made more explicit by maybe then you ask kind of you pop back up and say like what is your problem today? And they provide the problem
**[14:01:07 --> 14:01:09]** **6-A:**  and it goes back to the plan and they say great,
**[14:01:09 --> 14:01:10]** **6-A:**  I need to trigger policies.
**[14:01:11 --> 14:01:18]** **6-A:**  And then exactly you might have a tool call that says okay my problem is I never received my thing and I need a refund.
**[14:01:19 --> 14:01:22]** **6-A:**  and then there's a tool call that says this is how you do a refund.
**[14:01:23 --> 14:01:27]** **6-A:**  All of this gets packaged back into something like a plan,
**[14:01:28 --> 14:01:36]** **6-A:**  goes to the L_L_M_ and a full output is made and then sometimes turned into audio. So on the customer side you've said a few things
**[14:01:37 --> 14:01:42]** **6-A:**  and now all of these operations have occurred underneath the hood.
**[14:01:43 --> 14:02:08]** **6-A:**  So when you guys look things up online in terms of context engineering and prompt engineering, unfortunately this or not unfortunately, I guess, unsurprisingly, these are most of the use cases for the like top tier technology in terms of A_I_ at the moment, or at least the cutting edge techniques. They're related mostly to call centres, they're related mostly to business operations, sometimes they're related to code.
**[14:02:09 --> 14:02:28]** **6-A:**  But what we're gonna do today literally almost no one is doing on earth right now. We're gonna have you guys take from these operations 'cause these are best practices. They've been practising this a lot in terms of what's the best way to get consistent AI output. And you're going to retrofit them in order to make a sonnet.
**[14:02:29 --> 14:02:34]** **6-A:**  Uh so before we get in, I'm gonna show you one more industry doc.
**[14:02:35 --> 14:02:36]** **6-A:**  This is again from quad.
**[14:02:38 --> 14:03:01]** **6-A:**  This is kind of that joint moment. Your goal here. Good context, my marker is perishing, good context means finding the smallest possible set of high signal tokens that again maximise the likelihood of some desired outcome. And then there's a few other things here which I just find so funny that clearly
**[14:03:02 --> 14:03:07]** **6-A:**  engineers as opposed to complex concentrators are writing these documents.
**[14:03:10 --> 14:03:17]** **6-A:**  But let's talk about this. Can anyone and this might be more technical, it is slightly technical, can anyone tell me what they think a high signal token is?
**[14:03:21 --> 14:03:22]** **6-A:**  Yeah.
**[14:03:22 --> 14:03:27]** **6-B:**  The token that contains like a lot of the meaning of what you're actually asking the element to do.
**[14:03:27 --> 14:03:28]** **6-A:**  Precisely.
**[14:03:29 --> 14:03:41]** **6-A:**  So Jonah, there's Jonah, he works here, um he very frequently helps me like sort through all the documents that we have, readings for this class. And we're constantly building repos where we want context for the course.
**[14:03:41 --> 14:04:07]** **6-A:**  And often when we're ingesting uh the documents uh which are related to the readings for this course, there's a lot of uh frontage, a lot of frontage pages that tell us the publisher and the year and all of this other information, but those that's kind of noise. Those those are considered like noise tokens as opposed to high signal tokens, which in the case of your poetry um is the actual meat and content of the writing you guys have been consuming. And then of course you guys
**[14:04:07 --> 14:04:15]** **6-A:**  feel this even when you're reading. There are moments you decide to highlight. There are moments you decide oh this is the section where the argument is finally being made.
**[14:04:17 --> 14:04:32]** **6-A:**  So it might sound crazy. We're having you guys read these documents and you go high signal, token, right altitude for the age, like ah what is this? You've been doing it. This is just reading and writing text, operations you've been doing for a very very long time.
**[14:04:33 --> 14:04:51]** **6-A:**  So I'm very excited for you guys to do this. What we're going to do, you might see at each of your kind of stations, there's one computer. Uh we're gonna have you guys practice what eventually will be your assignment, but in the smallest most atomic way possible. So you are going to generate a sonnet.
**[14:04:52 --> 14:04:59]** **6-A:**  But you're gonna do this with two different tools. The first tool that you have is fairly obvious, it's your computer.
**[14:04:59 --> 14:05:20]** **6-A:**  And on your computer you're gonna have just chat windows, no coding, um even for those who like to code. Eventually we'll do that for you. The other tool you have is my favourite tool on earth, as you've probably noticed, and it's a piece of paper. Um but you also have cards, don't worry. And what we're gonna have you guys do
**[14:05:22 --> 14:05:27]** **6-A:**  is first just in a chat window in group so you guys are gonna be working as groups.
**[14:05:27 --> 14:05:50]** **6-A:**  First, just one shot a poem. So exactly like we've been talking about. Generate me a sonnet in the style of. So as a group pick a poet and then have it generate that first sonnet. And then as a group I want you to look at that sonnet and try to identify what's wrong with this sonnet according to, you know, and just obviously pick a poet that you all have been like reading in class ideally.
**[14:05:52 --> 14:05:59]** **6-A:**  And then I want you guys not to immediately start fixing, but first have a dialogue with your L_O_M_
**[14:06:00 --> 14:06:07]** **6-A:**  say, hey, I think this is bad in these reasons, but also I think these parts are good. So have a conversation back and forth.
**[14:06:08 --> 14:06:25]** **6-A:**  And what you'll start to see is you say okay I want you to try to do this now, please try to regenerate and it might still suck and you might have to still go back and forth, but eventually you might give it an instruction where it finally does it pretty well and you go this could be a step.
**[14:06:27 --> 14:06:41]** **6-A:**  So once it nails something based on an instruction, just be like oh okay, this is how I can get it to produce really good imagery in this way. Or maybe I want it first to decide a really good conceit for the poem, that'll like hold on through.
**[14:06:42 --> 14:06:47]** **6-A:**  Try to create like an atomic mechanic for step, and maybe that
**[14:06:49 --> 14:07:13]** **6-A:**  doing a close reading, maybe that's something to do with imagery. We're gonna kind of float around, but feel free to be really creative. It could be also a step of go fetch context on this author. Go fetch other poems by this author. It doesn't have to be something that's just related to like the making part. It could be like, what are those other materials I need? What's the markdown file? What's the equivalent of consumer data for making a sonnet?
**[14:07:13 --> 14:07:38]** **6-A:**  What's the equivalent of a policy for making a sonnet? Try to think through those operations. And then four, uh you're going to make a sequence. So then you're gonna operationalize these steps. So as you guys continue in your chat and you're like, oh, it's pretty good at this. Alright, well what order should we have done this in? And feel free to open new threads and new chats to see if that's the case. Say, well should I get author context first?
**[14:07:39 --> 14:08:07]** **6-A:**  Or should I decide um what kind of sonnet or in like what language I should be doing this or you know or or or and just try to make a sequence of these individual steps. And then at the very end we're gonna have everyone come up and you're gonna share not you can share like one sonnet output when you get to like that final sonnet your ultimate sonnet in the style of and just say why you think it's a good sonnet and what sequence of steps
**[14:08:08 --> 14:08:34]** **6-A:**  you used to get to that sonnet. So then if you had to leave that sequence alone, maybe there is a human in the loop step and you decide you can't go without it. But if you had to make this a s this sequence a stand-alone machine, what would that be? And we're gonna have you present it here, and we're gonna take a photo of your piece of paper, when you guys get to your final piece of paper. And on the back-end after this class, um Marlon and I are gonna turn it into code.
**[14:08:35 --> 14:08:46]** **6-A:**  And then we'll post a review of this workshop and the code on that front-end demo website that you guys played with earlier. So that is your task. Do we have any questions before we commence this task?
**[14:08:50 --> 14:08:50]** **6-A:**  Yeah.
**[14:08:50 --> 14:08:51]** **6-B:**  I have a small one.
**[14:08:51 --> 14:09:03]** **6-A:**  We have multiple different models. So you guys may have models on your own computers, that's totally fair game. Uh, but we have chat GPT Claude and Gemini open, you know, the holy trinity as it were for now. Uh
**[14:09:05 --> 14:09:31]** **6-A:**  You may use mistral, you may use grock. You may use I wish I had something a bit more, I don't know, um Dr. Seuss-ish uh to finish that. Uh so use whatever you want, however, meticulous step taking. And this isn't you guys individually going off. You guys have to collaboratively say I'm trying this step, it's pretty good. Like you guys can go on your computers and try different things at different times. But you all have to come back together and create a log.
**[14:09:31 --> 14:09:43]** **6-A:**  of what step goes where when does it also loop? So something we didn't talk about were kind of sequences, like maybe you have it generate a sonnet and then maybe you make a judge
**[14:09:44 --> 14:09:57]** **6-A:**  L_L_M_ that judges the quality of the sonnet and provides um prose and cons of whatever was written. Uh but you don't wanna do that one time, you wanna do that like N number of times.
**[14:09:57 --> 14:10:00]** **6-A:**  You can make this really funky. It doesn't have to just be like and this and this.

## Chunk 7

**[14:10:01 --> 14:10:05]** **7-A:**  And this it could be and you're probably gonna get a good result, but also feel free to have a bit more movement
**[14:10:12 --> 14:10:37]** **7-A:**  Eventually your assignments will be individual. So you know, a s one day, either in code, we also just trying to demonstrate to you all you can do a sequence just on a chat window if you don't wanna code and you really just wanna focus on your elements to make your song lyrics. But eventually for your song lyrics you will have to have a system like this. Like what is your prompt chain? Why did you construct your prompt chain like this?
**[14:10:37 --> 14:10:52]** **7-A:**  and then the song lyrics that you're turning in. And then once we get your guys' song lyrics, we might have like another little hackathon where we turn it into a song. Uh but yeah, that's what you'll be doing individually. This is just to help you practise as a group what that could look like.