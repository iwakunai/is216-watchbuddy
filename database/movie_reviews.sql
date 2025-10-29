CREATE TABLE IF NOT EXISTS public.movie_reviews (
    review_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id INT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_user_rating SMALLINT NOT NULL CHECK (movie_user_rating BETWEEN 0 AND 10),
    movie_user_review TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(movie_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_movie_reviews_movie_created_at
ON movie_reviews(movie_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_movie_reviews_user_created_at
ON movie_reviews(user_id, created_at DESC);
