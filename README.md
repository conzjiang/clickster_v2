# Qliqster
Track the TV shows you're watching or plan to watch through *watchlists*, similar to the way you track books via shelves in
<a href="http://goodreads.com" target="_blank">Goodreads</a>.

<a href="http://www.qliqster.com" target="_blank">Sign in</a> as a demo user or with your Facebook account to get started immediately!

# Technology
Qliqster is a Rails/Backbone.js web app. It stores photos using AWS's S3 photo storage, allows for Facebook login via Omniauth, and retrieves TV series information through the <a href="http://omdbapi.com/" target="_blank">OMDb API</a>.

On the go? No problem! Qliqster is responsively-designed, so you lose nothing of the experience when visiting Qliqster on your mobile device.

(Psst, also try out the text search. Notice how `brooklyn 99` brings up `Brooklyn Nine-Nine` as a result.)

# Testing
Models and Service objects are all unit tested with RSpec.
  * `spec/models`
  * `spec/services`

# Fixes in progress
Projects like these are never considered "finished." Curious about what Conz still has left to do? Check out her [todo list](TODO.md).
