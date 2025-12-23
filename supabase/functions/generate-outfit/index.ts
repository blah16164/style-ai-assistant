import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bodyShape, gender } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating outfit recommendations for ${gender} with ${bodyShape} body shape`);

    // Generate outfit recommendations using Gemini
    const textPrompt = `You are a professional fashion expert and personal stylist.
Based on the user's gender (${gender}) and body shape (${bodyShape}), recommend suitable outfits that flatter their figure.

Respond strictly in this format:

Tops:
• item 1
• item 2
• item 3

Bottoms:
• item 1
• item 2
• item 3

Colors:
• color 1
• color 2
• color 3

Accessories:
• item 1
• item 2

Keep recommendations specific, practical, and fashion-forward. Consider current trends while prioritizing what flatters the ${bodyShape} body type.`;

    const textResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert fashion consultant providing personalized styling advice.' },
          { role: 'user', content: textPrompt }
        ],
      }),
    });

    if (!textResponse.ok) {
      const errorText = await textResponse.text();
      console.error('Text generation error:', textResponse.status, errorText);
      
      if (textResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (textResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Text generation failed: ${errorText}`);
    }

    const textData = await textResponse.json();
    const recommendation = textData.choices?.[0]?.message?.content || '';
    console.log('Generated recommendation:', recommendation.substring(0, 100) + '...');

    // Generate outfit images
    const images: string[] = [];
    const imagePrompts = [
      `Professional fashion photography of a ${gender.toLowerCase()} model with ${bodyShape.toLowerCase()} body type wearing an elegant outfit. Studio lighting, high fashion editorial style, full body shot, neutral background, ultra high quality.`,
      `Fashion editorial photo of a ${gender.toLowerCase()} person with ${bodyShape.toLowerCase()} figure in casual chic attire. Natural lighting, lifestyle photography, stylish pose, modern aesthetic, 4K quality.`,
      `Luxury fashion campaign image of a ${gender.toLowerCase()} with ${bodyShape.toLowerCase()} proportions in sophisticated evening wear. Dramatic lighting, glamorous setting, professional model pose, magazine quality.`,
    ];

    for (let i = 0; i < 3; i++) {
      try {
        console.log(`Generating image ${i + 1}...`);
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image',
            messages: [
              { role: 'user', content: imagePrompts[i] }
            ],
            modalities: ['image', 'text'],
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            images.push(imageUrl);
            console.log(`Image ${i + 1} generated successfully`);
          }
        } else {
          console.error(`Image ${i + 1} generation failed:`, await imageResponse.text());
        }
      } catch (imgError) {
        console.error(`Error generating image ${i + 1}:`, imgError);
      }
    }

    return new Response(JSON.stringify({
      recommendation,
      images,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-outfit function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
